import * as functions from "firebase-functions";

export const helloWorld = (req: any, res: any) => {
  return res.status(200).send("Hello World!");
};

export const buildCrudService = (db: FirebaseFirestore.Firestore) => {
  const createItem = async (req: any, res: any) => {
    try {
      functions.logger.info("Create: " + req.body.item);
      await db
        .collection("items")
        .doc(req.body.id)
        .create({ item: req.body.item });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  };

  // read item
  const readItem = async (req: any, res: any) => {
    try {
      const document = db.collection("items").doc(req.params.item_id);
      const item = await document.get();
      const response = item.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  };

  // read all
  const readAll = async (req: any, res: any) => {
    try {
      const query = db.collection("items");
      const response: any[] = [];
      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs;
        for (const doc of docs) {
          const selectedItem = {
            id: doc.id,
            item: doc.data().item,
          };
          response.push(selectedItem);
        }
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  };

  const updateItem = async (req: any, res: any) => {
    try {
      const document = db.collection("items").doc(req.params.item_id);
      await document.update({
        item: req.body.item,
      });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  };

  const deleteItem = async (req: any, res: any) => {
    try {
      const document = db.collection("items").doc(req.params.item_id);
      await document.delete();
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  };

  return { createItem, readAll, readItem, updateItem, deleteItem };
};
