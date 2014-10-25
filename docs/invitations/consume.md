# Consuming an Invitation Flows and Responses
Invitations are way of property owners to add platform users or potential users to their property roommate list.

## Flow 1 - Success Flow
This Flow is the happy day flow

GET  /api/invitations/:key

Return:
Status Code: 200
Body:
```javascript
{
	response:{
		status:"consumed",
		key:"29a1bd805c8c11e48ed60800200c9a66",
		consumedBy:"example@email.com"
	}	
} 
```

## Flow 2 - Error: User is Not Loged In

GET  /api/invitations/:key

Return:
Status Code: 401
Body:
NO RESPONSE

## Flow 3 - Error: User is Not Invite Owner

GET  /api/invitations/:key

Return:
Status Code: 401
Body:
```javascript
{
	response:"user is not key owner"
} 
```

## Flow 3 - Error: User is Not Invite Owner

GET  /api/invitations/:key

Return:
Status Code: 401
Body:
```javascript
{
	response:"user is not key owner"
} 
```
## Flow 4 - Error: Property is full

GET  /api/invitations/:key

Return:
Status Code: 422
Body:
```javascript
{
	response:"property associated to this invitation is full"
} 
```

## Flow 5 - Property does not exist

GET  /api/invitations/:key

Return:
Status Code: 422
Body:
```javascript
{
	response:"property associated to this invitation no longer exist"
} 
```
## Flow 6 - Error: Invitation with that key don't exist

GET  /api/invitations/:key

Return:
Status Code: 404
Body:
```javascript
{
	response:"Invitation not found"
} 
```






