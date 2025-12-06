# Overpass API Integration for Pharmacy Search

## ✅ Integration Complete

Your pharmacy search service has been upgraded to use **OpenStreetMap Overpass API** - a free, powerful API optimized for POI (Point of Interest) queries.

## 🎯 Why Overpass API?

### Advantages over Nominatim:
1. **Better for POI queries** - Specifically designed for querying specific place types (pharmacies, restaurants, etc.)
2. **More accurate results** - Uses OpenStreetMap tags (`amenity=pharmacy`) for precise filtering
3. **More data fields** - Returns phone numbers, websites, and opening hours when available in OSM
4. **Radius search** - Can search within a specific radius (default: 10km) from coordinates
5. **Distance calculation** - Automatically calculates and sorts by distance from ZIP code center
6. **Completely FREE** - No API key required, no usage limits (within reasonable use)

## 📋 What Changed

### Updated Service: `server/services/pharmacyService.cjs`

**Before:** Used Nominatim API for both geocoding and pharmacy search
**After:** 
- Uses **Nominatim** for geocoding (ZIP code → coordinates)
- Uses **Overpass API** for pharmacy search (coordinates → pharmacies)

### Key Features:

1. **Radius-based search** - Searches pharmacies within 10km (configurable) of ZIP code center
2. **Distance sorting** - Results sorted by distance (closest first)
3. **Rich data** - Returns phone, website, opening hours when available
4. **Multiple OSM element types** - Searches nodes, ways, and relations tagged as pharmacy

## 🔧 API Details

### Overpass API Endpoint
- **URL:** `https://overpass-api.de/api/interpreter`
- **Method:** POST
- **Format:** Overpass QL (Query Language)
- **No API key required**

### Query Example
```overpass
[out:json][timeout:25];
(
  node["amenity"="pharmacy"](around:10000,32.7767,-96.7970);
  way["amenity"="pharmacy"](around:10000,32.7767,-96.7970);
  relation["amenity"="pharmacy"](around:10000,32.7767,-96.7970);
);
out center meta;
```

This query finds all pharmacies within 10km of the given coordinates.

## 📊 Response Format

The service returns pharmacies in this format:
```javascript
{
  success: true,
  pharmacies: [
    {
      id: "123456",
      name: "CVS Pharmacy",
      address: "123 Main St, Dallas, TX 75201",
      distance: 2.5, // miles from ZIP code center
      lat: 32.7767,
      lng: -96.7970,
      phone: "+1-555-123-4567",
      website: "https://www.cvs.com",
      openNow: true, // or false/null
      rating: null, // OSM doesn't provide ratings
      userRatingsTotal: 0
    }
  ],
  zipCode: "75201"
}
```

## 🚀 Usage

The API endpoint remains the same - no changes needed in your frontend:

```javascript
GET /api/search-pharmacies/:zipCode
```

Example:
```bash
GET /api/search-pharmacies/75201
```

## ⚙️ Configuration

You can adjust the search radius in `searchPharmaciesByZip()`:

```javascript
// Default: 10km radius
await pharmacyService.searchPharmaciesByZip('75201', 20, 10000);

// Custom: 5km radius
await pharmacyService.searchPharmaciesByZip('75201', 20, 5000);
```

## 🔍 How It Works

1. **Geocoding** (Nominatim): ZIP code → coordinates (lat/lng)
2. **Pharmacy Search** (Overpass): Coordinates + radius → pharmacies
3. **Distance Calculation**: Calculate distance from ZIP center to each pharmacy
4. **Sorting**: Sort by distance (closest first)
5. **Formatting**: Format results with address, phone, website, etc.

## 📝 Notes

- **Opening Hours**: Basic parsing included. For production, consider using a library like `opening-hours` for better parsing
- **Rate Limiting**: Overpass API is more lenient than Nominatim, but still respect reasonable usage
- **Data Quality**: Results depend on OpenStreetMap data quality in your area
- **Fallback**: If Overpass fails, you could add a fallback to Nominatim

## 🆚 Comparison with Other Free APIs

| Feature | Overpass API | Nominatim | Google Places |
|---------|-------------|-----------|---------------|
| **Cost** | ✅ Free | ✅ Free | ❌ Paid |
| **API Key** | ❌ Not needed | ❌ Not needed | ✅ Required |
| **POI Queries** | ✅ Excellent | ⚠️ Good | ✅ Excellent |
| **Radius Search** | ✅ Yes | ⚠️ Limited | ✅ Yes |
| **Phone/Website** | ✅ Yes (if in OSM) | ❌ No | ✅ Yes |
| **Opening Hours** | ✅ Yes (if in OSM) | ❌ No | ✅ Yes |
| **Ratings** | ❌ No | ❌ No | ✅ Yes |

## 🎉 Result

You now have a **completely free** pharmacy search solution that:
- ✅ Works without API keys
- ✅ Provides accurate, distance-sorted results
- ✅ Returns rich data (phone, website, hours)
- ✅ Is optimized for POI queries
- ✅ Has no usage limits (within reasonable use)

## 📚 Resources

- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [Overpass QL Tutorial](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL)
- [OpenStreetMap Tags](https://wiki.openstreetmap.org/wiki/Tags)

