import React, { Component } from 'react';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import farm from './data/farm.json';
import crops from './data/crops.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      allocations: []
      // e.g.
      // [
      //   {
      //     field: 'Big Field North',
      //     crop: 'Winter Wheat - Reflectance'
      //   },
      //   {
      //     field: 'Big Field South',
      //     crop: 'Winter Wheat - Skyfall'
      //   }
      // ]
    };
    this.setAllocations = (field, crop)=>{
      let allocations = this.state.allocations.slice(0); // clone
      if(crop === ''){
        // if crop is 'none'
        // then remove it from state.allocations
        for(let i = 0; i < allocations.length; i++){
          if(allocations[i].field===field){
            allocations.splice(i,1);
            break;
          }
        }
      }
      else{
        // if crop is not 'none'
        // then 
        // either ammend or add to state.allocations
        let match = false;
        for(let i = 0; i < allocations.length; i++){
          if(allocations[i].field === field){
            // ammend
            allocations[i].crop = crop;
            match = true;
            break;
          }
        }
        if(!match){
          //add
          allocations.push({ field, crop});
        }
      }
      this.setState({allocations});
    }
    this.getTotalYieldValue = ()=>{
      let totalYield = 0;
      this.state.allocations.forEach(allocation => {
          let field = farm.fields.find(
            (field)=>{
              return field.name===allocation.field;
            }
          );
          let crop = crops.find(
            (crop)=>{
              return crop.name===allocation.crop;
            }
          );
          totalYield += (
            crop.expected_yield
            * field.hectares
            / (
              crop.disease_risk_factor
              * field.disease_susceptibility
            )
            * crop.price_per_tonne
          )
      });
      return totalYield;
    }
  }

  render() {
    return (
      <section className="farm">
        <Map
          style={{ width: '600px', height: '400px' }}
          center={farm.centre.coordinates}
          zoom={13}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {farm.fields.map(field => <GeoJSON key={field.name} data={field.boundary} />)}
        </Map>

        <header>
          <h1>Assign crops to your fields to see yield</h1>
        </header>
        <p>Total yield value for your farm is {this.getTotalYieldValue()}</p>

        <section className="fields">
          <header>
            <h1>Fields</h1>
          </header>
          <ul>
            {farm.fields.map(field => <Field key={field.name} data={field} parent={this}/>)}
          </ul>
        </section>
      </section>
    );
  }
}


class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      crop : e.target.value
    });
    this.props.parent.setAllocations(this.props.data.name, e.target.value);
  }
  render(props) {
    return (
      <li className="crop">
        <header>
          <h2>{this.props.data.name}</h2>
        </header>
        <form>
          <label>
            Crop
            <select value={this.state.crop} onChange={this.handleChange}>
              <option value="">None</option>
              {crops.map(crop => <option key={crop.name} value={crop.name}>{crop.name}</option>)}
            </select>
          </label>
        </form>
      </li>
    );
  }
}
export default App;
