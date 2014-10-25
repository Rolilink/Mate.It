# Creating an Invitation Flows and Responses
Invitations are way of property owners to add platform users or potential users to their property roommate list.

## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/properties/:propertyid/invite?email=email

Return:
Status Code: 200
Body:
```javascript
{
	response:"sended"	
} 
```

## Flow 2 - Error: User is Not Loged In

POST /api/properties/:propertyid/invite?email=email

Return:
Status Code: 401
Body:
NO RESPONSE

## Flow 3 - Error: User is not property owner

POST /api/properties/:propertyid/invite?email=email

Return:
Status Code: 401
Body:
```javascript
{
	err:"user is not property owner"	
} 
```

## Flow 4 - Error: Email is the same as current user

POST /api/properties/:propertyid/invite?email=email

Return:
Status Code: 422
Body:
```javascript
{
	err:"user can't invite himself"	
} 
```

## Flow 5 - Error: Invited user exist and is listed as roommate of a property

POST /api/properties/:propertyid/invite?email=email

Return:
Status Code: 422
Body:
```javascript
{
	err:"user is already a roommate of a property"	
} 
```

## Flow 6 - Error: Missing Email or Invalid Email

POST /api/properties/:propertyid/invite

Return:
Status Code: 400
Body:
```javascript
{
	err:"Invalid email format"	
} 
```
