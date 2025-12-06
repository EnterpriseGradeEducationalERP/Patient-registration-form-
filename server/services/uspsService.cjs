/**
 * USPS Address Verification Service
 * 
 * This service integrates with USPS Web Tools API for address validation
 * Documentation: https://www.usps.com/business/web-tools-apis/address-information-api.htm
 * 
 * Requirements:
 * 1. Register at https://www.usps.com/business/web-tools-apis/welcome.htm
 * 2. Get your User ID from USPS
 * 3. Add USPS_USER_ID to your .env file
 */

const https = require('https');
const querystring = require('querystring');

class USPSService {
    constructor() {
        // USPS API Configuration
        this.testUrl = 'https://secure.shippingapis.com/ShippingAPI.dll';
        this.productionUrl = 'https://secure.shippingapis.com/ShippingAPI.dll';
        this.userId = process.env.USPS_USER_ID || '';
        this.useProduction = process.env.USPS_USE_PRODUCTION === 'true';
        
        if (!this.userId) {
            console.warn('⚠️  USPS_USER_ID not found in .env. Address verification will be disabled.');
        }
    }

    /**
     * Make HTTP request to USPS API
     */
    async makeRequest(xmlData) {
        return new Promise((resolve, reject) => {
            const url = this.useProduction ? this.productionUrl : this.testUrl;
            const postData = querystring.stringify({
                API: 'Verify',
                XML: xmlData
            });

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(url, options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    resolve(data);
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.write(postData);
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
     * Build XML request for Address Verification
     */
    buildAddressVerifyXML(address) {
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

        return `<?xml version="1.0"?>
<AddressValidateRequest USERID="${this.userId}">
    <Address ID="0">
        <Address1>${this.escapeXML(address1)}</Address1>
        <Address2>${this.escapeXML(address2)}</Address2>
        <City>${this.escapeXML(city)}</City>
        <State>${stateCode}</State>
        <Zip5>${zip5}</Zip5>
        <Zip4>${zip4 || ''}</Zip4>
    </Address>
</AddressValidateRequest>`;
    }

    /**
     * Parse USPS XML response
     */
    parseAddressResponse(xmlResponse) {
        try {
            // Simple XML parsing (for production, consider using xml2js or similar)
            const errorMatch = xmlResponse.match(/<Error>(.*?)<\/Error>/s);
            if (errorMatch) {
                const errorText = errorMatch[1].match(/<Description>(.*?)<\/Description>/);
                const errorNumber = errorMatch[1].match(/<Number>(.*?)<\/Number>/);
                return {
                    success: false,
                    error: errorText ? errorText[1] : 'Unknown error',
                    errorCode: errorNumber ? errorNumber[1] : null
                };
            }

            // Extract address components
            const address2Match = xmlResponse.match(/<Address2>(.*?)<\/Address2>/);
            const cityMatch = xmlResponse.match(/<City>(.*?)<\/City>/);
            const stateMatch = xmlResponse.match(/<State>(.*?)<\/State>/);
            const zip5Match = xmlResponse.match(/<Zip5>(.*?)<\/Zip5>/);
            const zip4Match = xmlResponse.match(/<Zip4>(.*?)<\/Zip4>/);

            const verifiedAddress = {
                address1: address2Match ? address2Match[1].trim() : '',
                address2: '',
                city: cityMatch ? cityMatch[1].trim() : '',
                state: stateMatch ? stateMatch[1].trim() : '',
                zip5: zip5Match ? zip5Match[1].trim() : '',
                zip4: zip4Match ? zip4Match[1].trim() : ''
            };

            return {
                success: true,
                verified: true,
                address: verifiedAddress
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to parse USPS response',
                details: error.message
            };
        }
    }

    /**
     * Escape XML special characters
     */
    escapeXML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    /**
     * Verify a single address
     * @param {Object} address - Address object with address1, address2, city, state, zip5
     * @returns {Promise<Object>} Verification result
     */
    async verifyAddress(address) {
        if (!this.userId) {
            return {
                success: false,
                error: 'USPS User ID not configured',
                verified: false
            };
        }

        try {
            // Build XML request
            const xmlRequest = this.buildAddressVerifyXML(address);
            console.log('USPS Request XML:', xmlRequest);
            
            // Make API request
            const xmlResponse = await this.makeRequest(xmlRequest, 'Verify');
            console.log('USPS Response:', xmlResponse.substring(0, 500));
            
            // Parse response
            const result = this.parseAddressResponse(xmlResponse);
            
            return result;
        } catch (error) {
            console.error('USPS API Error:', error);
            return {
                success: false,
                error: 'Failed to connect to USPS API: ' + error.message,
                details: error.message,
                verified: false
            };
        }
    }

    /**
     * Verify multiple addresses (batch)
     */
    async verifyAddresses(addresses) {
        const results = [];
        for (const address of addresses) {
            const result = await this.verifyAddress(address);
            results.push(result);
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return results;
    }

    /**
     * Get ZIP Code information
     */
    async getZipCodeInfo(zip5) {
        if (!this.userId) {
            return {
                success: false,
                error: 'USPS User ID not configured'
            };
        }

        try {
            const xmlRequest = `<?xml version="1.0"?>
<CityStateLookupRequest USERID="${this.userId}">
    <ZipCode ID="0">
        <Zip5>${zip5}</Zip5>
    </ZipCode>
</CityStateLookupRequest>`;

            const xmlResponse = await this.makeRequest(xmlRequest, 'CityStateLookup');
            
            // Check for errors
            const errorMatch = xmlResponse.match(/<Error>(.*?)<\/Error>/s);
            if (errorMatch) {
                const errorText = errorMatch[1].match(/<Description>(.*?)<\/Description>/);
                return {
                    success: false,
                    error: errorText ? errorText[1] : 'ZIP code lookup failed',
                    city: '',
                    state: ''
                };
            }
            
            const cityMatch = xmlResponse.match(/<City>(.*?)<\/City>/);
            const stateMatch = xmlResponse.match(/<State>(.*?)<\/State>/);
            
            return {
                success: true,
                city: cityMatch ? cityMatch[1].trim() : '',
                state: stateMatch ? stateMatch[1].trim() : ''
            };
        } catch (error) {
            console.error('ZIP lookup error:', error);
            return {
                success: false,
                error: error.message,
                city: '',
                state: ''
            };
        }
    }
}

module.exports = new USPSService();

