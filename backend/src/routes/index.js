import express from "express";
import ecopoints from "./ecopoint-routes.js";
import residues from "./residue-routes.js";
import auth from "./auth-routes.js";
import user from "./user-routes.js";
import email from "./email-route.js";
import ai from "./ai-routes.js";

const routes = (app) => {
    app.route("/").get((req, res) => {
        res.status(200).send("Ecocenter");
    })

    app.use(express.json(), ecopoints, residues, auth, user, email, ai);
}

export default routes;