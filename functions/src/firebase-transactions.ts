import * as functions from 'firebase-functions'

export const buildTransactionService = (db: FirebaseFirestore.Firestore) => {

    const buildInitialData = async (req: any, res: any) => {
        try {
            const cities = db.collection("cities")
            const warsaw = cities.doc("warsaw")
            const cracow = cities.doc("cracow")
            await warsaw.set({population: 1000000, capital: true})
            await cracow.set({population: 500000})
            return res.status(200).send()
        } catch (err) {
            console.log(err)
            return res.status(500).send(err)
        }
    }

    const incrementPopulation = async (req: any, res: any) => {
        const warsaw = db.collection("cities").doc("warsaw")
        
        try {
            await db.runTransaction(async transaction => {
                const warsawData = await transaction.get(warsaw)
                const newPopulation = (warsawData.data()?.population | 0) + 1
                transaction.update(warsaw, {population: newPopulation})
            })
            return res.status(200).send()
        } catch (err) {
            functions.logger.error(err)
            return res.status(500).send(err)            
        }
    }

    const incrementPopulations = async (req: any, res: any) => {
        try {
            const batch = db.batch()
            const warsaw = db.collection("cities").doc("warsaw")
            const cracow = db.collection("cities").doc("warsaw")
    
            batch.set(warsaw, {name: "Warszawa"}, {merge: true})
            batch.set(cracow, {name: "Kraków"}, {merge: true})

            await batch.commit()

            return res.status(200).send()
        } catch (err) {
            functions.logger.error(err)
            return res.status(500).send()
        }

    }

    return { buildInitialData, incrementPopulation, incrementPopulations }
}