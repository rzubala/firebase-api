const runFunctions = async (db: FirebaseFirestore.Firestore) => {
  const simpleQueries = async () => {
    const citiesRef = db.collection("cities");

    const capitals = await citiesRef.where("capital", "==", true).get();
    logData("capitals", capitals, (capital) => capital.data().name);

    const smallCities = await citiesRef.where("population", "<", 1000000).get();
    logData(
      "small cities",
      smallCities,
      (city) => city.data().name + " " + city.data().population
    );

    const westCoasts = await citiesRef
      .where("regions", "array-contains", "west_coast")
      .get();
    logData(
      "west coast",
      westCoasts,
      (city) => city.data().name + " " + city.data().regions
    );

    //logical OR == with arrays
    const westOrEastCosts = await citiesRef
      .where("regions", "array-contains-any", ["west_coast", "east_cost"])
      .get();
    logData(
      "east or west costs",
      westOrEastCosts,
      (city) => city.data().name + " " + city.data().regions
    );

    // logical OR ==
    const usaOrJapan = await citiesRef
      .where("country", "in", ["USA", "Japan"])
      .get();
    logData("usa or japan", usaOrJapan, (city) => city.data().name);

    //logical AND !=
    const notUsaNorJapan = await citiesRef
      .where("country", "not-in", ["USA", "Japan"])
      .get();
    logData(
      "not usa and not japan",
      notUsaNorJapan,
      (city) => city.data().name + " " + city.data().country
    );
  };

  const compoundQueries = async () => {
    const citiesRef = db.collection("cities");

    //const fail = await citiesRef.where('state', '>=', 'CA').where('population', '>', 1000000).get();

    const test1 = await citiesRef
      .where("state", ">=", "CA")
      .where("state", "<=", "IN")
      .get();
    logData("test1", test1, (item) => item.data().name);

    const test2 = await citiesRef
      .where("state", "==", "CA")
      .where("population", ">", 1000000)
      .get();
    logData("test2", test2, (item) => item.data().name);

    const querySnapshot = await db
      .collectionGroup("landmarks")
      .where("type", "==", "museum")
      .get();
    logData(
      "museums",
      querySnapshot,
      (item) => item.id + " => " + JSON.stringify(item.data())
    );
  };

  const limitQueries = async () => {
    const citiesRef = db.collection("cities");

    const firstThree = await citiesRef.limit(3).get();
    logData("first three", firstThree, (item) => item.data().name);

    const lastThree = await citiesRef.orderBy("name", "desc").limit(3).get();
    logData("last three", lastThree, (city) => city.data().name);

    const stateAndPop = await citiesRef
      .orderBy("state")
      .orderBy("population", "desc")
      .limit(3)
      .get();
    logData("order by state and pop", stateAndPop, (city) => city.data().name);

    const bigPop = await citiesRef
      .where("population", ">", 1000000)
      .orderBy("population", "desc")
      .limit(2)
      .get();
    logData(
      "big populations",
      bigPop,
      (city) => city.data().name + " " + city.data().population
    );
  };

  const paginationQueries = async () => {
    const citiesRef = db.collection("cities");

    const citiesByPopulation = await citiesRef.orderBy("population").get()
    logData("cities", citiesByPopulation, city => city.data().name + ": " + city.data().population)

    const startAt1000000 = await citiesRef.orderBy("population").startAt(1000000).get();
    logData("start at 1000000", startAt1000000, city => city.data().name + " " + city.data().population)

    const endAt1000000 = await citiesRef.orderBy("population").endAt(1000000).get();
    logData("end at 1000000", endAt1000000, city => city.data().name + " " + city.data().population)

    const cityRef = await citiesRef.doc("SF").get()
    const citiesStartAtSF = await citiesRef.orderBy("population").startAt(cityRef).get()
    logData("start at SF", citiesStartAtSF, city => city.data().name + ": " + city.data().population)

    const greatesCities = await citiesRef.orderBy("population").limit(3).get();
    const last = greatesCities.docs[greatesCities.docs.length - 1]

    const getNextGreatestCitites = await citiesRef.orderBy("population").startAfter(last.data().population).get()
    logData("start after last", getNextGreatestCitites, city => city.data().name + ": " + city.data().population)
  };

  (async () => {
    const citiesRef = db.collection("cities");

    await citiesRef.doc("SF").set({
      name: "San Francisco",
      state: "CA",
      country: "USA",
      capital: false,
      population: 860000,
      regions: ["west_coast", "norcal"],
    });
    await citiesRef.doc("LA").set({
      name: "Los Angeles",
      state: "CA",
      country: "USA",
      capital: false,
      population: 3900000,
      regions: ["west_coast", "socal"],
    });
    await citiesRef.doc("DC").set({
      name: "Washington, D.C.",
      state: null,
      country: "USA",
      capital: true,
      population: 680000,
      regions: ["east_coast"],
    });
    await citiesRef.doc("TOK").set({
      name: "Tokyo",
      state: null,
      country: "Japan",
      capital: true,
      population: 9000000,
      regions: ["kanto", "honshu"],
    });
    await citiesRef.doc("BJ").set({
      name: "Beijing",
      state: null,
      country: "China",
      capital: true,
      population: 21500000,
      regions: ["jingjinji", "hebei"],
    });
    await citiesRef.doc("SF").collection("landmarks").doc().set({
      name: "Golden Gate Bridge",
      type: "bridge",
    });
    await citiesRef.doc("SF").collection("landmarks").doc().set({
      name: "Legion of Honor",
      type: "museum",
    });
    await citiesRef.doc("LA").collection("landmarks").doc().set({
      name: "Griffith Park",
      type: "park",
    });
    await citiesRef.doc("LA").collection("landmarks").doc().set({
      name: "The Getty",
      type: "museum",
    });
    await citiesRef.doc("DC").collection("landmarks").doc().set({
      name: "Lincoln Memorial",
      type: "memorial",
    });
    await citiesRef.doc("DC").collection("landmarks").doc().set({
      name: "National Air and Space Museum",
      type: "museum",
    });
    await citiesRef.doc("TOK").collection("landmarks").doc().set({
      name: "Ueno Park",
      type: "park",
    });
    await citiesRef.doc("TOK").collection("landmarks").doc().set({
      name: "National Museum of Nature and Science",
      type: "museum",
    });
    await citiesRef.doc("BJ").collection("landmarks").doc().set({
      name: "Jingshan Park",
      type: "park",
    });
    await citiesRef.doc("BJ").collection("landmarks").doc().set({
      name: "Beijing Ancient Observatory",
      type: "museum",
    });
  })();

  console.log("data created");
  await delay(3000);

  simpleQueries();
  await delay(500);
  compoundQueries();
  await delay(500);
  limitQueries();
  await delay(500);
  paginationQueries();
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const logData = (
  tag: string,
  snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  toLog: (
    item: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
  ) => string
) => {
  console.log("\n*** " + tag);
  if (snapshot.empty) {
    console.log("\tempty");
  } else {
    snapshot.forEach((item) => console.log("\t", toLog(item)));
  }
};

export default runFunctions;
