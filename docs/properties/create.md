# Creating an Properties Flows and Responses
Properties are places where users stays

## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/properties
```javascript
{
	property:{
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
	}
} 
```

Return:
Status Code: 201
Body:
```javascript
{
	response:{
		property:{
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
		}
	}	
} 
```

## Flow 2 - Error Flow: User is not authenticated

POST /api/properties
```javascript
{
	user:{
		capacity: 4
	}
} 
```

Return:
Status Code: 401


## Flow 3 - Error Flow: Missing Required Fields

POST /api/properties
```javascript
{
	user:{
		capacity: 4
	}
} 
```

Return:
Status Code: 422
Body:
```javascript
{
	errors:[
		{
			type:"field_missing"
			field:"title"
		},
		{
			type:"field_missing"
			field:"description"
		}
		.
		.
		.
	]
} 
```

## Flow 4 - Error Flow: Validation Errors

POST /api/properties
```javascript
{
	property:{
		capacity: 0,
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
	}
} 
```

Return:
Status Code: 422
Body:
```javascript
{
	errors:[
		{
			type:"validation_err"
			field:"capacity"
		}
	]
} 
```




