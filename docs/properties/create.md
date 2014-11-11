# Creating an Properties Flows and Responses
Properties are places where propertys stays

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
	property:{
		capacity: 4,
		address: "Cerro Viento, Calle 62",
		country: "Panama",
		roomType: "private",
		propertyType: "house",
		genderAllowed: 'both',
		amenities: ['kitchen','internet','wifi'],
		price: 300,
		loc: [9.066006, -79.448069]
	}
} 
```

Return:
Status Code: 401


## Flow 3 - Error Flow: Missing Required Fields

POST /api/properties
```javascript
{
	property:{
		capacity: 4,
		address: "Cerro Viento, Calle 62",
		country: "Panama",
		roomType: "private",
		propertyType: "house",
		genderAllowed: 'both',
		amenities: ['kitchen','internet','wifi'],
		price: 300
	}
} 
```

Return:
Status Code: 422
Body:
```javascript
{
	{ errors: 
   { title: 
      { message: 'Path `title` is required.',
        name: 'ValidatorError',
        path: 'title',
        type: 'required' },
     description: 
      { message: 'Path `description` is required.',
        name: 'ValidatorError',
        path: 'description',
        type: 'required' } } }
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
		genderAllowed: 'none',
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
	{ errors: 
   { genderAllowed: 
      { message: '`none` is not a valid enum value for path `genderAllowed`.',
        name: 'ValidatorError',
        path: 'genderAllowed',
        type: 'enum',
        value: 'none' },
     capacity: 
      { message: 'Path `capacity` () is less than minimum allowed value (1).',
        name: 'ValidatorError',
        path: 'capacity',
        type: 'min',
        value: 0 } } }
} 
```




