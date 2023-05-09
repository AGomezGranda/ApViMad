import axios from 'axios';

let data = null;
const setData = (newData) => {
    data = newData;
}

const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';
const API_URL_POLIDEPORTIVOS = 'https://datos.madrid.es/egob/catalogo/200186-0-polideportivos.json';

async function fetchDataPolideportivos() {
    try {
        const response = await axios.get(CORS_PROXY_URL + encodeURIComponent(API_URL_POLIDEPORTIVOS));
        const data = response.data;
        setData(data);
    } catch (error) {
        console.error(error);
    }
};

function Polideportivos() {
  const indexOfLastEvent = 10;
  const indexOfFirstEvent = 0;

  const sportsCenter = data && data['@graph'].slice(indexOfFirstEvent, indexOfLastEvent);

  return (
    
      <div className="container-fluid">
        <div className="d-flex justify-content-center my-5">
          <p>Centros deportivos de Madrid</p>
        </div>

        <div className="row">
                    {sportsCenter && sportsCenter.map((item) => (
                        <div key={item['@id']} className="col-md-6 mb-5">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h3 className="card-title">{item.title}</h3>
                                    <br />
                                    <h5 className="card-title">Location: </h5>
                                    <p className="card-text">{item.address['street-address']}</p>
                                    <p className="card-text">{item.address['postal-code']}</p>
                                    <p className="card-text">{item.address.locality}</p>
                                    <a className='card-title' href={item.relation}> Link</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
      </div>
    
  );
}

export default { Polideportivos, fetchDataPolideportivos };
