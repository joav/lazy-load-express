import express = require('express');
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { RoutesLoader } from './shared/routes-loader';

const app = express();

app.use(cors());
app.use(json())
app.use(urlencoded({extended: true}));
// app.use('/api');

new RoutesLoader(app);

console.log('Está bien o no');

app.listen(3300, args => {
    console.log('listen on 3300', args);
})
