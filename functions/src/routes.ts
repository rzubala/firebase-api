import {Express} from 'express'
import { helloWorld, buildCrudService } from './firebase-functions';
import { buildTransactionService } from './firebase-transactions'

export default (app: Express, db: FirebaseFirestore.Firestore) => {
    const service = buildCrudService(db)
    app.route("/hello-world").get(helloWorld)
    app.route("/api/create").post(service.createItem)
    app.route("/api/read/:item_id").get(service.readItem)
    app.route("/api/read").get(service.readAll)
    app.route("/api/update/:item_id").put(service.updateItem)
    app.route("/api/delete/:item_id").delete(service.deleteItem)

    const transactions = buildTransactionService(db)
    app.route("/transactions/initial").post(transactions.buildInitialData)
    app.route("/transactions/increment").post(transactions.incrementPopulation)
    app.route("/transactions/increments").post(transactions.incrementPopulations)
}