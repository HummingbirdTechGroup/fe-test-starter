# Hummingbird Frontend Test Starter App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Prerequisits

First up you will need [NodeJS](https://nodejs.org/en/) installed on your system to run the build tools & test runner.


## Getting Started

To install the app dependencies do a
```
npm install
```


Run app in the development mode.
```
npm start
```
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

Run unit tests
```
npm test
```

Mapping is set up with React-Leaflet read more about it and the underlying Leaflet.js below
- https://github.com/PaulLeCam/react-leaflet
- http://leafletjs.com/

## The Challenge
We are looking for a simple, visual dashboard to aid the Farm Manager in creating their optimal harvest ready for the next season. Using this dashboard they should be able to assign crops to fields and see the potential yield value per field (based on the crop configuration they choose and data provided via the API).

This is not a design task, but consideration must be given to the fact that the platform must be easily usable.


#### Yield Value Calculation
```
Crop Yield Average * Hectares of Field / (Crop Risk Factor * Field Disease Susceptibility) * price per tonne per field summed over all fields
```

### Scenarios
1.  **Given I am a farmer** </br>
When I go to the platform homepage </br>
Then I should see all my fields visualised with their boundaries


1. **Given I am a farmer**</br>
And I am on my platform homepage
When I add a crop to a field
Then I should see that the field contains the selected crop

1. **Given I am a farmer**</br>
And I am on my platform homepage</br>
When I add a crop to a field</br>
Then I should see the Yield potential calculation updated based on the current configuration

1. **Given I am a farmer**</br>
And I am on my platform homepage</br>
When I replace a crop in a field</br>
Then I should see the Yield potential calculation updated based on the current configuration

1. **Given I am a farmer**</br>
And I am on my platform homepage</br>
When I remove a crop from a field</br>
Then I should see the Yield potential calculation updated based on the current configuration


### API Details
A set of mock endpoints have been created to supply the information required to build this product.

The endpoints you will require can be reached with the following urls: 

Farm: GET http://www.mocky.io/v2/5cc809b5300000a300055eac

Crops: GET http://www.mocky.io/v2/5cc8098e300000a300055eab

