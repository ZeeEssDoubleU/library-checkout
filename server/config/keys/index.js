import keys_dev from "./keys-dev";
import keys_prod from "./keys-prod";

export default process.env.NODE_ENV === "production" 
   ? keys_prod 
   : keys_dev;
