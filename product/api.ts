import axios from 'axios';
import { Product } from './types';
import Papa from 'papaparse';

export default {
  list: async (): Promise<Product[]> => {
    return axios
      .get(
        `https://docs.google.com/spreadsheets/d/e/2PACX-1vTaKdFIlZoeYwvYStcjaLcfgaCau4WIo7zmjSfa3CCZ0HG_CfqDG8g5uyE8N2MdkJXEW2x5k1YRp3RB/pub?output=csv`,
        {
          responseType: 'blob',
        }
      )
      .then((response) => {
        return new Promise<Product[]>((resolve, reject) => {
          Papa.parse(response.data, {
            header: true,
            complete: (results) => {
              const products = results.data as Product[];

              return resolve(
                products.map((product) => ({
                  ...product,
                  price: Number(product.price),
                }))
              );
            },
            error: (error) => {
              return reject(error.message);
            },
          });
        });
      });
  },
};
