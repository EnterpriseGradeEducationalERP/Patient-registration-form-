/**
 * Smarty Streets Address Verification Service
 * 
 * This service integrates with Smarty Streets API for address verification
 * Documentation: https://www.smarty.com/docs
 * 
 * Requirements:
 * 1. Sign up at https://www.smarty.com/
 * 2. Get your Auth ID and Auth Token (Secret Keys) from API Keys page
 * 3. Add to .env file:
 *    - SMARTY_AUTH_ID=your_auth_id
 *    - SMARTY_AUTH_TOKEN=your_auth_token
 * 
 * Note: Use Secret Keys for server-side code (this service)
 *       Use Embedded Keys for client-side code (if needed)
 */

const https = require('https');
const querystring = require('querystring');

class SmartyService {
    constructor() {
        // Smarty API Configuration
        this.authId = process.env.SMARTY_AUTH_ID || '';
        this.authToken = process.env.SMARTY_AUTH_TOKEN || '';
        this.baseUrl = 'https://us-street.api.smarty.com';
        this.zipCodeUrl = 'https://us-zipcode.api.smarty.com';
        this.autocompleteUrl = 'https://us-autocomplete-pro.api.smarty.com';
        
        if (!this.authId || !this.authToken) {
            console.warn('⚠️  Smarty credentials not found in .env. Address verification will be disabled.');
            console.warn('💡 Add SMARTY_AUTH_ID and SMARTY_AUTH_TOKEN to .env file');
        } else {
            console.log('✅ Smarty Streets API configured');
        }
    }

    /**
     * Make HTTP request to Smarty API
     */
    async makeRequest(url, queryParams = {}) {
        if (!this.authId || !this.authToken) {
            throw new Error('Smarty credentials not configured');
        }

        // Add authentication parameters
        const params = {
            'auth-id': this.authId,
            'auth-token': this.authToken,
            ...queryParams
        };

        const queryString = querystring.stringify(params);
        const fullUrl = `${url}?${queryString}`;
        const urlObj = new URL(fullUrl);

        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'PatientRegistrationApp/1.0'
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            // Smarty returns array of results
                            const jsonData = JSON.parse(data);
                            resolve(jsonData);
                        } else {
                            // Try to parse error response
                            try {
                                const errorData = JSON.parse(data);
                                
                                // Handle Smarty-specific error formats
                                let errorMessage = 'Unknown error';
                                
                                if (errorData.errors && Array.isArray(errorData.errors)) {
                                    errorMessage = errorData.errors.map(e => e.message || e).join(', ');
                                } else if (errorData.errors && typeof errorData.errors === 'string') {
                                    errorMessage = errorData.errors;
                                } else if (errorData.message) {
                                    errorMessage = errorData.message;
                                } else if (typeof errorData === 'string') {
                                    errorMessage = errorData;
                                }
                                
                                // Check for authentication errors
                                if (res.statusCode === 401 || res.statusCode === 403) {
                                    errorMessage = 'Smarty API authentication failed. Please check your SMARTY_AUTH_ID and SMARTY_AUTH_TOKEN in the .env file.';
                                } else if (res.statusCode === 402) {
                                    errorMessage = 'Smarty API subscription issue. Please check your account status.';
                                } else if (res.statusCode === 429) {
                                    errorMessage = 'Smarty API rate limit exceeded. Please try again later.';
                                }
                                
                                reject({
                                    statusCode: res.statusCode,
                                    error: { message: errorMessage }
                                });
                            } catch {
                                // If we can't parse JSON, check status code
                                let errorMessage = data || 'Unknown error from Smarty API';
                                
                                if (res.statusCode === 401 || res.statusCode === 403) {
                                    errorMessage = 'Smarty API authentication failed. Please check your SMARTY_AUTH_ID and SMARTY_AUTH_TOKEN in the .env file.';
                                } else if (res.statusCode === 402) {
                                    errorMessage = 'Smarty API subscription issue. Please check your account status.';
                                } else if (res.statusCode === 429) {
                                    errorMessage = 'Smarty API rate limit exceeded. Please try again later.';
                                }
                                
                                reject({
                                    statusCode: res.statusCode,
                                    error: { message: errorMessage }
                                });
                            }
                        }
                    } catch (error) {
                        reject(new Error(`Failed to parse response: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Request error: ${error.message}`));
            });

            req.setTimeout(15000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    /**
     * Convert full state name to 2-letter code
     */
    getStateCode(state) {
        if (!state) return '';
        
        // If already 2 letters, return as is
        if (state.length === 2) {
            return state.toUpperCase();
        }
        
        // State name to code mapping
        const stateMap = {
            'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
            'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
            'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
            'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
            'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
            'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
            'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
            'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
            'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
            'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
            'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
            'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
            'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC', 'dc': 'DC'
        };
        
        const stateLower = state.toLowerCase().trim();
        return stateMap[stateLower] || state.toUpperCase().substring(0, 2);
    }

    /**
     * Verify and standardize an address
     * @param {Object} address - Address object
     * @param {string} address.address1 - Street address line 1
     * @param {string} address.address2 - Street address line 2 (optional)
     * @param {string} address.city - City
     * @param {string} address.state - State (2-letter code or full name)
     * @param {string} address.zip5 - 5-digit ZIP code
     * @param {string} address.zip4 - 4-digit ZIP+4 extension (optional)
     * @returns {Promise<Object>} Verification result
     */
    async verifyAddress(address) {
        if (!this.authId || !this.authToken) {
            return {
                success: false,
                verified: false,
                error: 'Smarty credentials not configured'
            };
        }

        try {
            const {
                address1 = '',
                address2 = '',
                city = '',
                state = '',
                zip5 = '',
                zip4 = ''
            } = address;

            // Convert state to 2-letter code
            const stateCode = this.getStateCode(state);

            // Validate minimum required fields for Smarty
            if (!address1 || address1.trim().length === 0) {
                return {
                    success: false,
                    verified: false,
                    error: 'Street address is required for verification'
                };
            }

            // Build query parameters for Smarty Street Address API
            const queryParams = {
                street: address1.trim(),
                secondary: address2 && address2.trim().length > 0 ? address2.trim() : undefined,
                city: city && city.trim().length > 0 ? city.trim() : undefined,
                state: stateCode || undefined,
                zipcode: zip5 && zip5.trim().length > 0 ? zip5.trim() : undefined,
                'zipcode+4': zip4 && zip4.trim().length > 0 ? zip4.trim() : undefined,
                candidates: 1 // Number of candidate addresses to return
            };

            // Remove undefined values
            Object.keys(queryParams).forEach(key => {
                if (queryParams[key] === undefined) {
                    delete queryParams[key];
                }
            });

            // Make API request
            const response = await this.makeRequest(`${this.baseUrl}/street-address`, queryParams);

            // Smarty returns an array of candidate addresses
            if (Array.isArray(response) && response.length > 0) {
                const result = response[0];
                
                // Check if address was verified
                // Smarty precision levels: Zip9, Zip8, Zip7, Zip6, Zip5, Zip4, Zip3, Zip2, Zip1, None
                const precision = result.metadata?.precision || 'None';
                const verified = precision !== 'None' && precision !== 'Zip1' && precision !== 'Zip2' && precision !== 'Zip3';
                
                // Determine verification status message
                let verificationMessage = 'Address verified';
                if (precision === 'Zip9') {
                    verificationMessage = 'Address verified with ZIP+4';
                } else if (precision === 'Zip8' || precision === 'Zip7' || precision === 'Zip6') {
                    verificationMessage = 'Address verified with partial ZIP+4';
                } else if (precision === 'Zip5') {
                    verificationMessage = 'Address verified with 5-digit ZIP';
                } else if (precision === 'Zip4') {
                    verificationMessage = 'Address verified with 4-digit ZIP';
                }
                
                // Check for address corrections
                const hasCorrections = result.analysis && (
                    result.analysis.dpv_match_code !== 'Y' ||
                    result.analysis.active !== 'Y' ||
                    result.analysis.vacant !== 'N'
                );
                
                return {
                    success: true,
                    verified: verified,
                    address: {
                        address1: result.delivery_line_1 || '',
                        address2: result.delivery_line_2 || '',
                        city: result.components.city_name || '',
                        state: result.components.state_abbreviation || '',
                        zip5: result.components.zipcode || '',
                        zip4: result.components.plus4_code || ''
                    },
                    metadata: {
                        precision: precision,
                        recordType: result.metadata?.record_type || null,
                        county: result.metadata?.county_name || null,
                        latitude: result.metadata?.latitude || null,
                        longitude: result.metadata?.longitude || null,
                        timeZone: result.metadata?.time_zone || null,
                        utcOffset: result.metadata?.utc_offset || null,
                        dpvMatchCode: result.analysis?.dpv_match_code || null,
                        active: result.analysis?.active || null,
                        vacant: result.analysis?.vacant || null
                    },
                    analysis: result.analysis || null,
                    verificationMessage: verificationMessage,
                    hasCorrections: hasCorrections
                };
            } else {
                // No candidates found - address not verified
                return {
                    success: true,
                    verified: false,
                    error: 'Address could not be verified. Please check the address and try again.',
                    address: null,
                    verificationMessage: 'Address not found'
                };
            }
        } catch (error) {
            console.error('Smarty API Error:', error);
            
            // Handle error response
            if (error.statusCode) {
                let errorMessage = 'Address could not be verified';
                
                if (error.error) {
                    if (Array.isArray(error.error)) {
                        errorMessage = error.error.map(e => e.message || e).join(', ');
                    } else if (typeof error.error === 'object' && error.error.message) {
                        errorMessage = error.error.message;
                    } else if (typeof error.error === 'string') {
                        errorMessage = error.error;
                    }
                }
                
                // Provide user-friendly error messages
                if (error.statusCode === 401 || error.statusCode === 403) {
                    errorMessage = 'Smarty API authentication failed. Please check your API credentials in the server configuration.';
                } else if (error.statusCode === 402) {
                    errorMessage = 'Smarty API subscription issue. Please check your account status or billing.';
                } else if (error.statusCode === 429) {
                    errorMessage = 'Smarty API rate limit exceeded. Please try again in a few moments.';
                } else if (error.statusCode >= 500) {
                    errorMessage = 'Smarty API service temporarily unavailable. Please try again later.';
                }
                
                return {
                    success: false,
                    verified: false,
                    error: errorMessage,
                    statusCode: error.statusCode
                };
            }

            // Handle connection errors
            if (error.message.includes('credentials not configured')) {
                return {
                    success: false,
                    verified: false,
                    error: 'Smarty API credentials not configured. Please add SMARTY_AUTH_ID and SMARTY_AUTH_TOKEN to your .env file.'
                };
            }

            return {
                success: false,
                verified: false,
                error: 'Failed to connect to Smarty API: ' + error.message
            };
        }
    }

    /**
     * Get city and state from ZIP code
     * @param {string} zip5 - 5-digit ZIP code
     * @returns {Promise<Object>} City and state information
     */
    async getCityStateFromZip(zip5) {
        if (!this.authId || !this.authToken) {
            return {
                success: false,
                error: 'Smarty credentials not configured',
                city: '',
                state: ''
            };
        }

        try {
            const response = await this.makeRequest(`${this.zipCodeUrl}/lookup`, {
                zipcode: zip5
            });

            // Smarty ZIP Code API returns an array
            if (Array.isArray(response) && response.length > 0) {
                const result = response[0];
                const cityState = result.city_states && result.city_states[0];
                
                return {
                    success: true,
                    city: cityState?.city || '',
                    state: cityState?.state_abbreviation || '',
                    zipCode: zip5
                };
            } else {
                return {
                    success: false,
                    error: 'ZIP code not found',
                    city: '',
                    state: ''
                };
            }
        } catch (error) {
            console.error('Smarty ZIP lookup error:', error);
            
            if (error.statusCode) {
                const errorMessage = Array.isArray(error.error) 
                    ? error.error.map(e => e.message || e).join(', ')
                    : error.error?.message || 'ZIP code lookup failed';
                
                return {
                    success: false,
                    error: errorMessage,
                    city: '',
                    state: ''
                };
            }

            return {
                success: false,
                error: error.message || 'Failed to lookup ZIP code',
                city: '',
                state: ''
            };
        }
    }

    /**
     * Address autocomplete (suggestions as user types)
     * @param {string} prefix - Partial address string
     * @param {Object} options - Additional options
     * @returns {Promise<Array>} Array of address suggestions
     */
    async autocompleteAddress(prefix, options = {}) {
        if (!this.authId || !this.authToken) {
            return {
                success: false,
                error: 'Smarty credentials not configured',
                suggestions: []
            };
        }

        try {
            const queryParams = {
                search: prefix,
                max_results: options.maxResults || 10,
                ...options
            };

            const response = await this.makeRequest(`${this.autocompleteUrl}/lookup`, queryParams);

            // Smarty Autocomplete returns suggestions array
            if (Array.isArray(response.suggestions)) {
                return {
                    success: true,
                    suggestions: response.suggestions.map(suggestion => ({
                        text: suggestion.text,
                        street_line: suggestion.street_line,
                        city: suggestion.city,
                        state: suggestion.state
                    }))
                };
            } else {
                return {
                    success: true,
                    suggestions: []
                };
            }
        } catch (error) {
            console.error('Smarty Autocomplete error:', error);
            
            if (error.statusCode) {
                const errorMessage = Array.isArray(error.error) 
                    ? error.error.map(e => e.message || e).join(', ')
                    : error.error?.message || 'Autocomplete failed';
                
                return {
                    success: false,
                    error: errorMessage,
                    suggestions: []
                };
            }

            return {
                success: false,
                error: error.message || 'Failed to get autocomplete suggestions',
                suggestions: []
            };
        }
    }
}

module.exports = new SmartyService();

