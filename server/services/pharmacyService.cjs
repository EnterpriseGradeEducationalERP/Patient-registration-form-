/**
 * Pharmacy Search Service using OpenStreetMap Overpass API
 * 
 * This service searches for nearby pharmacies using ZIP code
 * Documentation: https://wiki.openstreetmap.org/wiki/Overpass_API
 * 
 * Benefits:
 * - Completely FREE (no API key required)
 * - Better for POI queries than Nominatim
 * - More accurate pharmacy results with specific tags
 * - Can search within radius from coordinates
 * - Returns phone, website, opening hours if available in OSM
 * - Open source and community-driven
 */

const https = require('https');

class PharmacyService {
    constructor() {
        // Overpass API is free - no API key needed!
        this.overpassUrl = 'https://overpass-api.de/api/interpreter';
        this.nominatimUrl = 'https://nominatim.openstreetmap.org'; // Still use for geocoding
        this.userAgent = 'PatientRegistrationApp/1.0'; // Required by Nominatim usage policy
        this.lastRequestTime = 0;
        this.minRequestInterval = 1100; // 1.1 seconds between requests (respects 1 req/sec limit)
        
        console.log('✅ Using FREE OpenStreetMap Overpass API for pharmacy search');
        console.log('💡 No API key required - completely free to use!');
        console.log('📋 Overpass API is optimized for POI queries like pharmacies');
    }

    /**
     * Rate limiting helper - Nominatim allows 1 request per second
     */
    async waitForRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.minRequestInterval) {
            const waitTime = this.minRequestInterval - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        this.lastRequestTime = Date.now();
    }

    /**
     * Make HTTP request to Nominatim API (for geocoding)
     */
    async makeNominatimRequest(endpoint, params = {}) {
        // Respect rate limit (1 request per second)
        await this.waitForRateLimit();
        
        return new Promise((resolve, reject) => {
            // Add default params for Nominatim
            const queryParams = new URLSearchParams({
                format: 'json',
                addressdetails: '1',
                ...params
            });

            const url = `${this.nominatimUrl}${endpoint}?${queryParams.toString()}`;
            const urlObj = new URL(url);

            const options = {
                hostname: urlObj.hostname,
                port: 443,
                path: urlObj.pathname + urlObj.search,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': this.userAgent // Required by Nominatim usage policy
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
                            reject(new Error(`Nominatim API request failed: ${res.statusCode} - ${data}`));
                            return;
                        }

                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
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
     * Make HTTP request to Overpass API (for pharmacy search)
     */
    async makeOverpassRequest(query) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(this.overpassUrl);

            const options = {
                hostname: urlObj.hostname,
                port: 443,
                path: urlObj.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
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
                            reject(new Error(`Overpass API request failed: ${res.statusCode} - ${data}`));
                            return;
                        }

                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (error) {
                        reject(new Error(`Failed to parse response: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Request error: ${error.message}`));
            });

            req.setTimeout(30000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            // Send query as POST data
            req.write(`data=${encodeURIComponent(query)}`);
            req.end();
        });
    }

    /**
     * Get ZIP code center coordinates (using Nominatim Geocoding)
     */
    async getZipCodeCoordinates(zipCode) {
        try {
            const response = await this.makeNominatimRequest('/search', {
                postalcode: zipCode,
                countrycodes: 'us',
                limit: 5 // Get multiple results to find the best match
            });

            if (response && response.length > 0) {
                // Find the result that matches our ZIP code exactly
                const exactMatch = response.find(loc => {
                    const address = loc.address || {};
                    const postalCode = address.postcode || '';
                    // Extract first 5 digits from postal code
                    const zip = postalCode.replace(/\D/g, '').substring(0, 5);
                    return zip === zipCode;
                });

                // Use exact match if found, otherwise use first result
                const location = exactMatch || response[0];
                
                // Verify the postal code matches
                const address = location.address || {};
                const postalCode = address.postcode || '';
                const zip = postalCode.replace(/\D/g, '').substring(0, 5);
                
                if (zip !== zipCode) {
                    console.warn(`⚠️  Geocoding warning: ZIP code ${zipCode} returned coordinates for ZIP ${zip || 'unknown'}`);
                }

                return {
                    lat: parseFloat(location.lat),
                    lng: parseFloat(location.lon),
                    verifiedZip: zip === zipCode
                };
            }

            return null;
        } catch (error) {
            console.error('Geocoding error:', error.message);
            return null;
        }
    }

    /**
     * Calculate distance between two coordinates (Haversine formula)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3959; // Earth radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Search for pharmacies near a ZIP code using Overpass API (FREE)
     * @param {string} zipCode - 5-digit ZIP code
     * @param {number} limit - Maximum number of results (default: 20)
     * @param {number} radius - Search radius in meters (default: 10000 = 10km)
     * @returns {Promise<Array>} List of pharmacies
     */
    async searchPharmaciesByZip(zipCode, limit = 20, radius = 10000) {
        try {
            // First, get the coordinates of the ZIP code area
            const zipCoords = await this.getZipCodeCoordinates(zipCode);
            
            if (!zipCoords) {
                return {
                    success: true,
                    pharmacies: [],
                    message: 'ZIP code not found',
                    zipCode: zipCode
                };
            }

            // Log for debugging
            console.log(`🔍 Searching pharmacies for ZIP code ${zipCode} at coordinates (${zipCoords.lat}, ${zipCoords.lng})`);

            // Build Overpass QL query to find pharmacies within radius
            // Searches for nodes, ways, and relations tagged as pharmacy
            const query = `
                [out:json][timeout:25];
                (
                  node["amenity"="pharmacy"](around:${radius},${zipCoords.lat},${zipCoords.lng});
                  way["amenity"="pharmacy"](around:${radius},${zipCoords.lat},${zipCoords.lng});
                  relation["amenity"="pharmacy"](around:${radius},${zipCoords.lat},${zipCoords.lng});
                );
                out center meta;
            `;

            const response = await this.makeOverpassRequest(query);

            if (!response || !response.elements || response.elements.length === 0) {
                return {
                    success: true,
                    pharmacies: [],
                    message: 'No pharmacies found near this ZIP code',
                    zipCode: zipCode
                };
            }

            // Format pharmacy results from Overpass response
            const allPharmacies = response.elements
                .map((element, index) => {
                    const tags = element.tags || {};
                    const coords = element.center || { lat: element.lat, lon: element.lon };
                    
                    // Get postal code from tags
                    const pharmacyPostalCode = tags['addr:postcode'] || '';
                    
                    // Build address from tags
                    const addressParts = [];
                    if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
                    if (tags['addr:street']) addressParts.push(tags['addr:street']);
                    if (tags['addr:city']) addressParts.push(tags['addr:city']);
                    if (tags['addr:state']) addressParts.push(tags['addr:state']);
                    if (pharmacyPostalCode) addressParts.push(pharmacyPostalCode);
                    
                    const fullAddress = addressParts.length > 0 
                        ? addressParts.join(', ') 
                        : tags['addr:full'] || '';

                    // Calculate distance from ZIP code center
                    const distance = coords.lat && coords.lon 
                        ? this.calculateDistance(zipCoords.lat, zipCoords.lng, coords.lat, coords.lon)
                        : null;

                    // Check if postal code matches the searched ZIP code
                    // Extract first 5 digits from postal code (handles ZIP+4 format)
                    const pharmacyZip = pharmacyPostalCode.replace(/\D/g, '').substring(0, 5);
                    const matchesZipCode = pharmacyZip === zipCode;

                    return {
                        id: element.id || `pharmacy_${index}`,
                        name: tags.name || tags['name:en'] || 'Pharmacy',
                        address: fullAddress,
                        postalCode: pharmacyPostalCode,
                        matchesZipCode: matchesZipCode, // Flag for filtering
                        rating: null, // Overpass doesn't provide ratings
                        userRatingsTotal: 0,
                        openNow: tags.opening_hours ? this.parseOpeningHours(tags.opening_hours) : null,
                        distance: distance ? parseFloat(distance.toFixed(2)) : null,
                        lat: coords.lat ? parseFloat(coords.lat) : null,
                        lng: coords.lon ? parseFloat(coords.lon) : null,
                        phone: tags.phone || tags['contact:phone'] || null,
                        website: tags.website || tags['contact:website'] || null
                    };
                });

            // Filter: Prioritize pharmacies with matching ZIP code
            // First, get pharmacies that match the ZIP code
            const matchingPharmacies = allPharmacies.filter(p => p.matchesZipCode);
            const nearbyPharmacies = allPharmacies.filter(p => !p.matchesZipCode);
            
            // If we have matching pharmacies, use only those
            // Otherwise, use all pharmacies (they're nearby but might have different ZIP codes)
            const pharmaciesToUse = matchingPharmacies.length > 0 
                ? matchingPharmacies 
                : allPharmacies;

            // Sort by: 1) ZIP code match (matching first), 2) distance (closest first)
            const pharmacies = pharmaciesToUse
                .sort((a, b) => {
                    // First, prioritize ZIP code matches
                    if (a.matchesZipCode && !b.matchesZipCode) return -1;
                    if (!a.matchesZipCode && b.matchesZipCode) return 1;
                    
                    // Then sort by distance
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return a.distance - b.distance;
                })
                // Remove the matchesZipCode flag before returning
                .map(({ matchesZipCode, postalCode, ...pharmacy }) => pharmacy)
                // Limit results
                .slice(0, limit);

            // Create informative message
            let message = '';
            if (matchingPharmacies.length > 0) {
                message = `Found ${matchingPharmacies.length} pharmacy${matchingPharmacies.length !== 1 ? 'ies' : ''} in ZIP code ${zipCode}`;
                if (nearbyPharmacies.length > 0) {
                    message += ` (${nearbyPharmacies.length} nearby excluded)`;
                }
            } else if (pharmacies.length > 0) {
                message = `Found ${pharmacies.length} nearby pharmacy${pharmacies.length !== 1 ? 'ies' : ''} (none in ZIP code ${zipCode})`;
            } else {
                message = `No pharmacies found near ZIP code ${zipCode}`;
            }

            console.log(`✅ Found ${matchingPharmacies.length} matching and ${nearbyPharmacies.length} nearby pharmacies for ZIP ${zipCode}`);

            return {
                success: true,
                pharmacies: pharmacies,
                zipCode: zipCode,
                message: message,
                stats: {
                    matching: matchingPharmacies.length,
                    nearby: nearbyPharmacies.length,
                    total: allPharmacies.length
                }
            };

        } catch (error) {
            console.error('Pharmacy search error:', error);
            return {
                success: false,
                error: error.message || 'Failed to search pharmacies',
                pharmacies: []
            };
        }
    }

    /**
     * Simple opening hours parser (basic check)
     * Returns true if likely open, false if likely closed, null if unknown
     */
    parseOpeningHours(openingHours) {
        if (!openingHours) return null;
        
        // Very basic check - in production, use a proper library
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
        const hour = now.getHours();
        
        // Check for "24/7" or "Mo-Su 00:00-24:00"
        if (openingHours.includes('24/7') || openingHours.includes('00:00-24:00')) {
            return true;
        }
        
        // Check for "closed" indicators
        if (openingHours.toLowerCase().includes('closed') || 
            openingHours.toLowerCase().includes('off')) {
            return false;
        }
        
        // For more complex parsing, you'd need a library like opening-hours
        // For now, return null (unknown)
        return null;
    }

    /**
     * Search pharmacies by coordinates using Overpass API
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {number} radius - Search radius in meters (default: 10000)
     * @param {number} limit - Maximum number of results (default: 20)
     * @returns {Promise<Array>} List of pharmacies
     */
    async searchPharmaciesByCoordinates(lat, lng, radius = 10000, limit = 20) {
        try {
            const query = `
                [out:json][timeout:25];
                (
                  node["amenity"="pharmacy"](around:${radius},${lat},${lng});
                  way["amenity"="pharmacy"](around:${radius},${lat},${lng});
                  relation["amenity"="pharmacy"](around:${radius},${lat},${lng});
                );
                out center meta;
            `;

            const response = await this.makeOverpassRequest(query);

            if (!response || !response.elements || response.elements.length === 0) {
                return {
                    success: true,
                    pharmacies: [],
                    message: 'No pharmacies found near this location'
                };
            }

            const pharmacies = response.elements
                .map((element, index) => {
                    const tags = element.tags || {};
                    const coords = element.center || { lat: element.lat, lon: element.lon };
                    
                    const addressParts = [];
                    if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
                    if (tags['addr:street']) addressParts.push(tags['addr:street']);
                    if (tags['addr:city']) addressParts.push(tags['addr:city']);
                    if (tags['addr:state']) addressParts.push(tags['addr:state']);
                    if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);
                    
                    const fullAddress = addressParts.length > 0 
                        ? addressParts.join(', ') 
                        : tags['addr:full'] || '';

                    const distance = coords.lat && coords.lon 
                        ? this.calculateDistance(lat, lng, coords.lat, coords.lon)
                        : null;

                    return {
                        id: element.id || `pharmacy_${index}`,
                        name: tags.name || tags['name:en'] || 'Pharmacy',
                        address: fullAddress,
                        rating: null,
                        userRatingsTotal: 0,
                        openNow: tags.opening_hours ? this.parseOpeningHours(tags.opening_hours) : null,
                        distance: distance ? parseFloat(distance.toFixed(2)) : null,
                        lat: coords.lat ? parseFloat(coords.lat) : null,
                        lng: coords.lon ? parseFloat(coords.lon) : null,
                        phone: tags.phone || tags['contact:phone'] || null,
                        website: tags.website || tags['contact:website'] || null
                    };
                })
                .sort((a, b) => {
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return a.distance - b.distance;
                })
                .slice(0, limit);

            return {
                success: true,
                pharmacies: pharmacies
            };

        } catch (error) {
            console.error('Pharmacy coordinate search error:', error);
            return {
                success: false,
                error: error.message || 'Failed to search pharmacies',
                pharmacies: []
            };
        }
    }
}

module.exports = new PharmacyService();

