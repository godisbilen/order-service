# Car order service

This service solves the problem of delivery bookings. The service allows both bookings with a fixed time and 'as soon as possible' bookings.

The delivery area is divided into smaller areas that can contain several cars. Orders are assigned to a car, where the order can be completed at the earliest. The driver of the car is notified when an order is placed via an SMS.

## Installation

1. Download the project from github
    - `git clone https://github.com/godisbilen/car_order_service`
2. Make sure you have node.js & npm installed on your machine.
    - You can find the download link [here](https://nodejs.org/en/download/).
3. Install dependencies.
    - Run `npm install` when you are in the root directory of the project.

## Npm scripts

| Script    | Description                                |
| --------- | ------------------------------------------ |
| build     | Build for production                       |
| start     | Run production code                        |
| start:dev | Run development code                       |
| dev       | Run development code (restarts on changes) |
| test      | Run ESlint test                            |

## Envirement variables

| Variable            | Required | Description                     |
| ------------------- | -------- | ------------------------------- |
| PORT                | false    | The port to start the server on |
| DB_URL              | true     | URL to mongoose database        |
| GOOGLE_MAPS_API_KEY | true     | API key for google maps api     |
| BUDGETSMS_USERID    | true     | BudgetSMS userid                |
| BUDGETSMS_USERNAME  | true     | BudgetSMS username              |
| BUDGETSMS_HANDLE    | true     | BudgetSMS handler               |
| BUDGETSMS_FROM      | true     | Name of sms sender              |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[Creative Commons Attribution Share Alike 4.0 International](LICENSE)
