import './App.css';
import React, { useEffect, useState } from 'react';


function App() {
  let storeSymbols=[];
  let storeState = {};
 
  const [exchangeProduct, setExchangeProduct] = useState([]);
  const [markPrice, setMarkPrice] = useState({});
  var socket= new WebSocket("wss://production-esocket.delta.exchange");
  
  useEffect(() => {
    onLoad();
  },[]);


  function connectWithSocket(symbol){
    
    storeSymbols.push(symbol)
    let payload = {
      "type": "subscribe",
      "payload": {
          "channels": [
              {
                  "name": "v2/ticker",
                  "symbols": storeSymbols
              }
          ]
        }
    }
  
    socket.onopen = () => {
      socket?.send(JSON.stringify(payload));
    };
   
    socket.onmessage = (event) => {
      if(event){
        if(typeof((event?.data)=== 'string')){
          if(event && event?.data){
            const obj = JSON.parse(event.data);
            if(obj?.symbol &&  obj?.mark_price){
              storeState[obj?.symbol] = obj?.mark_price;
             
              setMarkPrice(storeState)
             
            } 
          } 
        }
      }
  };
    
    return symbol
  }

  


  async function onLoad(){
   
    let fetchResponse = await fetch( "https://api.delta.exchange/v2/products",{});
    let response = await fetchResponse.json();
    if(response.success){
      let results = response.result;
      setExchangeProduct(results.slice(0,50))
    }
   
  }

  return (
    <div>
      <>
        <h1>Delta - React Engineer - Assignment</h1>
      </>
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Description</th>
          <th>Underlying Asset</th>
          <th>Mark Price</th>
        </tr>
      </thead>
      <tbody>
        {exchangeProduct.map((exchange, index) => (
            <tr key={`${exchange.symbol}-${index}`}>
            <td className='symboltd'>{connectWithSocket(exchange.symbol)}</td>
            <td className='descriptiontd'>{exchange.description}</td>
            <td className='assettd'>
           
            <ol>
              <li>Name : {exchange.underlying_asset.name || ''}</li>
              <li>Base withdrawal fee : {exchange.underlying_asset.base_withdrawal_fee || ''}</li>
              <li>Deposit status : {exchange.underlying_asset.deposit_status || ''}</li>
            </ol> 

            </td>
            {/* <td>{`${exchange.underlying_asset.base_withdrawal_fee} ${exchange.underlying_asset.base_withdrawal_fee} ${exchange.underlying_asset.base_withdrawal_fee}`}</td> */}
            <td>{markPrice[exchange.symbol] || 'Calculating..'}</td>
          </tr>
        ))}
        
      </tbody>
    </table>
  </div>
  );
}

export default App;