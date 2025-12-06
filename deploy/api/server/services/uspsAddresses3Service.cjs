/**
 * USPS Addresses 3.0 API Service
 * 
 * This service integrates with USPS Addresses 3.0 API (REST API with OAuth 2.0)
 * Documentation: https://devs.usps.com/
 * 
 * Requirements:
 * 1. Register at https://devs.usps.com/
 * 2. Create OAuth application
 * 3. Get Client ID and Client Secret
 * 4. Add to .env file:
 *    - USPS_CLIENT_ID=your_client_id
 *    - USPS_CLIENT_SECRET=your_client_secret
 */

const https = require('https');
const http = require('http');
const querystring = require('querystring');

class USPSAddresses3Service {
    constructor() {
        // OAuth Configuration
        this.clientId = process.env.USPS_CLIENT_ID || '';
        this.clientSecret = process.env.USPS_CLIENT_SECRET || '';
        this.tokenUrl = process.env.USPS_OAUTH_TOKEN_URL || 'https://apis.usps.com/oauth2/v3/token';
        
        // API Configuration
        this.useProduction = process.env.USPS_USE_PRODUCTION === 'true';
        this.baseUrl = process.env.USPS_API_BASE_URL || 
            (this.useProduction 
                ? 'https://apis.usps.com/addresses/v3'
                : 'https://apis-tem.usps.com/addresses/v3');
        
        // Token cache
        this.accessToken = null;
        this.tokenExpiry = null;
        
        if (!this.clientId || !this.clientSecret) {
            console.warn('⚠️  USPS OAuth credentials not found in .env. Address verification will be disabled.');
            console.warn('💡 Add USPS_CLIENT_ID and USPS_CLIENT_SECRET to .env file');
        }
    }

    /**
     * Get OAuth Access Token
     */
    async getAccessToken() {
        // Check if we have a valid cached token
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        if (!this.clientId || !this.clientSecret) {
            throw new Error('USPS OAuth credentials not configured');
        }

        return new Promise((resolve, reject) => {
            const postData = querystring.stringify({
                grant_type: 'client_credentials',
                scope: 'addresses'
            });

            const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

            const url = new URL(this.tokenUrl);
            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData),
                    'Authorization': `Basic ${auth}`
                }
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        if (res.statusCode !== 200) {
                            reject(new Error(`OAuth token request failed: ${res.statusCode} - ${data}`));
                            return;
                        }

                        const tokenData = JSON.parse(data);
                        this.accessToken = tokenData.access_token;
                        // Set expiry to 50 minutes (tokens usually last 1 hour)
                        this.tokenExpiry = Date.now() + (50 * 60 * 1000);

                        console.log('✅ USPS OAuth token obtained');
                        resolve(this.accessToken);
                    } catch (error) {
                        reject(new Error(`Failed to parse OAuth token response: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`OAuth token request error: ${error.message}`));
            });

            req.write(postData);
            req.end();
        });
    }

    /**
     * Make HTTP request to USPS Addresses 3.0 API
     */
    async makeRequest(endpoint, queryParams = {}) {
        try {
            // Get OAuth token
            const token = await this.getAccessToken();

            // Build query string
            const queryString = querystring.stringify(queryParams);
            const fullUrl = `${this.baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;

            const url = new URL(fullUrl);

            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname + url.search,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            };

            return new Promise((resolve, reject) => {
                const req = https.request(options, (res) => {
                    let data = '';

                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    res.on('end', () => {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            try {
                                const jsonData = JSON.parse(data);
                                resolve(jsonData);
                            } catch (error) {
                                reject(new Error(`Failed to parse JSON response: ${error.message}`));
                            }
                        } else {
                            try {
                                const errorData = JSON.parse(data);
                                reject({
                                    statusCode: res.statusCode,
                                    error: errorData.error || { message: 'Unknown error' }
                                });
                            } catch {
                                reject({
                                    statusCode: res.statusCode,
                                    error: { message: data || 'Unknown error' }
                                });
                            }
                        }
                    });
                });

                req.on('error', (error) => {
                    reject(new Error(`Request error: ${error.message}`));
                });

                req.setTimeout(10000, () => {
                    req.destroy();
                    reject(new Error('Request timeout'));
                });

                req.end();
            });
        } catch (error) {
            throw error;
        }
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
     * @returns {Promise<Object>} Verification result
     */
    async verifyAddress(address) {
        if (!this.clientId || !this.clientSecret) {
            const error = new Error('USPS OAuth credentials not configured');
            error.name = 'OAuthNotConfigured';
            throw error;
        }

        try {
            const {
                streetAddress = '',
                secondaryAddress = '',
                city = '',
                state = '',
                zipCode = '',
                zipPlus4 = '',
                firm = ''
            } = address;

            // Convert state to 2-letter code
            const stateCode = this.getStateCode(state);

            // Build query parameters
            const queryParams = {
                streetAddress: streetAddress,
                state: stateCode
            };

            // Add optional parameters
            if (secondaryAddress) queryParams.secondaryAddress = secondaryAddress;
            if (city) queryParams.city = city;
            if (zipCode) queryParams.ZIPCode = zipCode;
            if (zipPlus4) queryParams.ZIPPlus4 = zipPlus4;
            if (firm) queryParams.firm = firm;

            // Make API request
            const response = await this.makeRequest('/address', queryParams);

            // Parse response
            if (response && response.address) {
                return {
                    success: true,
                    verified: true,
                    address: {
                        address1: response.address.streetAddress || '',
                        address2: response.address.secondaryAddress || '',
                        city: response.address.city || '',
                        state: response.address.state || '',
                        zip5: response.address.ZIPCode || '',
                        zip4: response.address.ZIPPlus4 || ''
                    },
                    additionalInfo: response.additionalInfo || {},
                    corrections: response.corrections || [],
                    matches: response.matches || [],
                    warnings: response.warnings || []
                };
            } else {
                return {
                    success: false,
                    verified: false,
                    error: 'Invalid response from USPS API'
                };
            }
        } catch (error) {
            console.error('USPS Addresses 3.0 API Error:', error);
            
            // Handle error response
            if (error.statusCode) {
                const errorMessage = error.error?.message || 
                    error.error?.errors?.[0]?.detail || 
                    'Address could not be verified';
                
                return {
                    success: false,
                    verified: false,
                    error: errorMessage,
                    statusCode: error.statusCode
                };
            }

            return {
                success: false,
                verified: false,
                error: 'Failed to connect to USPS API: ' + error.message
            };
        }
    }

    /**
     * Get city and state from ZIP code
     * @param {string} zipCode - 5-digit ZIP code
     * @returns {Promise<Object>} City and state information
     */
    async getCityStateFromZip(zipCode) {
        if (!this.clientId || !this.clientSecret) {
            const error = new Error('USPS OAuth credentials not configured');
            error.name = 'OAuthNotConfigured';
            throw error;
        }

        try {
            const response = await this.makeRequest('/city-state', {
                ZIPCode: zipCode
            });

            if (response && response.city && response.state) {
                return {
                    success: true,
                    city: response.city,
                    state: response.state,
                    zipCode: response.ZIPCode || zipCode
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid response from USPS API',
                    city: '',
                    state: ''
                };
            }
        } catch (error) {
            console.error('ZIP lookup error:', error);
            
            if (error.statusCode) {
                const errorMessage = error.error?.message || 
                    error.error?.errors?.[0]?.detail || 
                    'ZIP code lookup failed';
                
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
     * Get ZIP code from address
     * @param {Object} address - Address object
     * @returns {Promise<Object>} ZIP code information
     */
    async getZipCodeFromAddress(address) {
        if (!this.clientId || !this.clientSecret) {
            return {
                success: false,
                error: 'USPS OAuth credentials not configured'
            };
        }

        try {
            const {
                streetAddress = '',
                secondaryAddress = '',
                city = '',
                state = '',
                zipCode = '',
                zipPlus4 = '',
                firm = ''
            } = address;

            const stateCode = this.getStateCode(state);

            const queryParams = {
                streetAddress: streetAddress,
                city: city,
                state: stateCode
            };

            if (secondaryAddress) queryParams.secondaryAddress = secondaryAddress;
            if (zipCode) queryParams.ZIPCode = zipCode;
            if (zipPlus4) queryParams.ZIPPlus4 = zipPlus4;
            if (firm) queryParams.firm = firm;

            const response = await this.makeRequest('/zipcode', queryParams);

            if (response && response.address) {
                return {
                    success: true,
                    zipCode: response.address.ZIPCode || '',
                    zipPlus4: response.address.ZIPPlus4 || ''
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid response from USPS API'
                };
            }
        } catch (error) {
            console.error('ZIP code lookup error:', error);
            return {
                success: false,
                error: error.message || 'Failed to lookup ZIP code'
            };
        }
    }
}

module.exports = new USPSAddresses3Service();

