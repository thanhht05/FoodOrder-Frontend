## Response get cart detail

```
{
    "statusCode": 200,
    "error": null,
    "message": "Call api success",
    "data": {
        "quantity": 7,
        "totalPrice": 158000.0,
        "productsInnerCartDetail": [
            {
                "id": 8,
                "name": "Matcha late 2",
                "price": 25000.0,
                "categoryName": "Sweet",
                "img": "1ad1103b-2b3c-4bba-b915-2e6a52675b16.jpg",
                "quantity": 88
            },
            {
                "id": 11,
                "name": "Coffee2",
                "price": 20000.0,
                "categoryName": "Coffee",
                "img": "71869fac-698b-4182-9190-c8b4f06d5d28.jpg",
                "quantity": 11
            },


        ]
    }
}
```

## Response add product to cart

```
{
    "statusCode": 200,
    "error": null,
    "message": "Call api success",
    "data": {
        "quantity": 16,
        "totalPrice": 445000.0,
        "productsInnerCartDetail": [
            {
                "id": 8,
                "name": "Matcha late 2",
                "price": 25000.0,
                "categoryName": "Sweet",
                "img": "1ad1103b-2b3c-4bba-b915-2e6a52675b16.jpg",
                "quantity": 10
            },
            {
                "id": 11,
                "name": "Coffee2",
                "price": 20000.0,
                "categoryName": "Coffee",
                "img": "71869fac-698b-4182-9190-c8b4f06d5d28.jpg",
                "quantity": 1
            },
            {
                "id": 7,
                "name": "Matcha late 1",
                "price": 20000.0,
                "categoryName": "Sweet",
                "img": "24808629-bdf4-4f75-a30c-67d451a4f5ae.jpg",
                "quantity": 2
            },

        ]
    }
}
```
