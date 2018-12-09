import React, {Component} from 'react';
import {Map, TileLayer, GeoJSON} from 'react-leaflet';
import _ from 'lodash';
import 'leaflet/dist/leaflet.css';
import './App.css'
import {Button, Collection, CollectionItem, Row, Col, Table, Icon} from 'react-materialize'

class App extends Component {

    palette = ['#E4572E', '#001F54', '#034078', '#1282A2', '#721121', '#4D9DE0', '#EAC435', '#E40066', '#03CEA4', '#7A3B69']; // Should be taken from a theme/config file

    setCentre = () => {

        let centre = _
            .chain(this.state.fields)
            .reduce((res, field) => _.concat(res, field.boundary.coordinates), [])
            .flatten()
            .reduce((res, latLng) => {
                res[0].push(latLng[0]);
                res[1].push(latLng[1]);
                return res;
            }, [[], []])
            .map(latLng => [_.max(latLng), _.min(latLng)], [])
            .reduce((res, minMax) => _.concat(res, minMax[0] + ((minMax[1] - minMax[0]) / 2)), [])
            .reverse() // LngLat?
            .value();

        this.setState({centre: centre});

    };

    calculateYield = () => {

        // Crop Yield Average * Hectares of Field / (Crop Risk Factor * Field Disease Susceptibility) * price
        return _
            .chain(this.state.fields)
            .filter(field => field.crop)
            .reduce((res, field) => res +
                ((field.crop['expected_yield'] * field['hectares']) /
                    (field.crop['disease_risk_factor'] * field['disease_susceptibility']) *
                    field.crop['price_per_tonne']), 0)
            .value()
            .toString();
    };

    buttonClickHandler = () => {

        let optimised = _.map(this.state.fields, field => {
            let resArr = _.map(this.state.crops, crop => {
                crop.yieldValue = (
                    ((crop['expected_yield'] * field['hectares']) /
                    (crop['disease_risk_factor'] * field['disease_susceptibility'])) *
                    crop['price_per_tonne']);
                return crop;
            });
            field.crop = _.maxBy(resArr, 'yieldValue');
            return field;
        });

        this.setState({fields: optimised});

    };

    fieldClickHandler = (field) => {

        let newFields = _.clone(this.state.fields), newField = _.clone(field);
        delete newField.crop;

        let foundIndex = _.findIndex(newFields, {id: newField.id});
        newFields.splice(foundIndex, 1, newField);

        this.setState({fields: newFields});
    };

    onDragStart = (e, crop) => {
        e.dataTransfer.setData("crop", JSON.stringify(crop));
    };

    onDragOver = e => {
        e.preventDefault();
    };

    onDrop = (e, field) => {

        e.preventDefault();
        let newField = _.clone(field), newFields = _.clone(this.state.fields);
        newField.crop = JSON.parse(e.dataTransfer.getData("crop"));

        let foundIndex = _.findIndex(newFields, {id: newField.id});
        newFields.splice(foundIndex, 1, newField);

        this.setState({fields: newFields});
    };

    constructor(props) {

        super(props);
        this.state = {
            fields: [],
            crops: [],
            yieldValue: 0,
            centre: null
        }
    }

    async componentDidMount() {

        const farmPromise = await fetch('https://private-bf7f31-hummingbirdsimple.apiary-mock.com/farm');
        const cropsPromise = await fetch('https://private-bf7f31-hummingbirdsimple.apiary-mock.com/crops');

        let farm = await farmPromise.json();
        let crops = await cropsPromise.json();

        // reuses colours if > palette length
        crops = _.map(crops, (crop, i) => _.assign(crop, {id: i, colour: this.palette[i % this.palette.length]}));
        let fields = _.map(farm.fields, (field, i) => _.assign(field, {id: i}));

        this.setState({fields: fields, crops: crops});
        this.setCentre();

    }

    render() {

        const style = {
            map: {
                width: '100%',
                height: '100vh',
                margin: 'auto'
            },
            crop: colour => {
                return {
                    backgroundColor: colour || 'black',
                    color: 'white',
                    cursor: 'pointer'
                }
            },
            field: colour => {
                return {
                    color: colour || 'black',
                    cursor: 'pointer'
                }
            }
        };

        return (

            <Row className={'ff-grid'} style={{marginBottom: 0}}>

                <Col s={3}>

                    <Collection header='Crops'>

                        {
                            this.state.crops && this.state.crops.map((crop, i) =>
                                <CollectionItem
                                    draggable="true"
                                    onDragStart={e => this.onDragStart(e, crop)}
                                    key={'crop-' + i}
                                    style={style.crop(crop.colour)}>
                                    <Icon tiny left style={style.crop(crop.colour)}>drag_indicator</Icon>
                                    <span>{crop.name}</span>
                                </CollectionItem>
                            )
                        }

                    </Collection>

                    <span><span>Drag and Drop a crop to the field list </span><Icon>arrow_right_alt</Icon></span>

                </Col>

                <Col s={6} style={{padding: '0'}}>

                    <Map
                        style={style.map}
                        center={this.state.centre}
                        zoom={13}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        {
                            this.state.fields && this.state.fields.map((field) =>
                                <GeoJSON
                                    key={field.name}
                                    data={field.boundary}
                                    {...style.field(field.crop && field.crop.colour)}/> // https://github.com/PaulLeCam/react-leaflet/issues/166#issue-157143165
                            )
                        }
                    </Map>

                </Col>

                <Col s={3}>

                    <Collection header='Fields' style={{overflow: 'hidden', overflowY: 'scroll', flex: '1'}}>
                        {
                            this.state.fields && this.state.fields.map(field =>
                                <CollectionItem
                                    onClick={() => this.fieldClickHandler(field)}
                                    style={field.crop ? style.crop(field.crop && field.crop.colour) : style.field()}
                                    onDragOver={e => {
                                        this.onDragOver(e)
                                    }}
                                    onDrop={e => {
                                        this.onDrop(e, field)
                                    }}
                                    key={field.name}>
                                    {field.name} {field.crop && (' (' + field.crop.name.split(' - ')[1] + ')')}
                                    {field.crop ? <Icon right>filter_vintage</Icon> : null}
                                </CollectionItem>
                            )
                        }

                    </Collection>

                    <Table>

                        <thead>
                        <tr>
                            <th>YIELD</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            <td>
                                <Button waves='light' onClick={this.buttonClickHandler}>
                                    Optimise
                                </Button>
                            </td>
                            <td>{Math.round(this.calculateYield())}</td>
                        </tr>
                        </tbody>

                    </Table>

                </Col>

            </Row>

        );
    }
}

export default App;
