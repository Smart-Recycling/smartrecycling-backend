# Smart Recycling API Docs

Smart Recycling API is built using Express.js and MySQL. Below is the documentation for the available endpoints.

[Full documentation right here](https://documenter.getpostman.com/view/18031605/2s9Ykn82CC)

## Installation

> Install the required dependencies:

> > npm i

> > yarn install

> > pnpm install

---

## Run testing

Follow the following steps to run the test [on this file](./test.txt)

## Usage

Test the API using [`POSTMAN`](https://www.postman.com/) or any other API testing tool.

> [**IMPORT FIRST TO SEE ENDPOINTS**](/Smart%20Recycling%20New%20API.postman_collection.json)

## Table of Endpoints

| No. | Endpoints                         | Method |
| --- | --------------------------------- | ------ |
| 1   | /api/signup                       | POST   |
| 2   | /api/signin                       | POST   |
| 3   | /api/user                         | GET    |
| 4   | /api/users [admin]                | GET    |
| 5   | /api/user/points                  | POST   |
| 6   | /api/user/change-role             | GET    |
| 7   | /api/reports                      | GET    |
| 8   | /api/reports                      | POST   |
| 9   | /api/events                       | GET    |
| 10  | /api/events                       | POST   |
| 11  | /api/events/:id                   | PUT    |
| 12  | /api/exchange                     | POST   |
| 12  | /api/exchange                     | POST   |
| 13  | /api/exchange/:user_id            | POST   |
| 14  | /api/payment-history/:user_id     | GET    |
| 15  | /api/transaction-history/:user_id | GET    |
| 16  | /api/payment-method               | POST   |
| 17  | /api/transaction-payment          | POST   |
| 18  | /api/items                        | GET    |
| 19  | /api/items                        | POST   |
| 20  | /api/items/:id                    | PUT    |

Credit to [Jody Yuantoro](https://github.com/xyzuan) and [Syauqi](https://github.com/syauqiamiq)

[MIT LICENSE](https://github.com/rizkyhaksono/smartrecycling-be/blob/main/LICENSE)
