# Listing an Properties Flows and Responses
Properties are places where users stays

## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/properties/list
``javascript
{
	query:{
		available: true,
		loc: {
			$near:{
				$maxDistance: 1,
				$geometry: { type: 'Point', coordinates: [ 9.066005, -79.46 ] }
			}
		}
	},
	limit: 2,
	page: 1
} 
```

Return:
Status Code: 200
Body:
```javascript
{
	response:{
		properties:[{
			id: "29a1bd805c8c11e48ed60800200c9a66",
			available: true,
			capacity: 4,
			address: "Cerro Viento, Calle 62",
			country: "Panama",
			roomType: "private",
			propertyType: "house",
			title: "This is a Title",
			description: "asdasdasdasdas sadasdasdasdas asdasdasdasdasdasd asdasdas",
			genderAllowed: 'both',
			amenities: ['kitchen','internet','wifi'],
			price: 300,
			loc: [9.066006, -79.448069]
		}]
	}	
} 
```

## Flow 2 - Error Flow: User is not authenticated

POST /api/properties/list
``javascript
{
	query:{
		available: true,
		loc: {
			$near:{
				$maxDistance: 1,
				$geometry: { type: 'Point', coordinates: [ 9.066005, -79.46 ] }
			}
		}
	},
	limit: 2,
	page: 1
} 
```
```

Return:
Status Code: 401