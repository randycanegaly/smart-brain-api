//Changing to the gRPC method

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
// const Clarifai = require('clarifai');
// console.log(Clarifai);

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key b7737cfa4b9b42caa350999e2c84e63e");

const handleImage = () => (req, res) => {
    console.log('input', req.body);
    stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: "face-detection",
        inputs: [{data: {image: {url: req.body.url}}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }

        console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
        res.json(response)
    }
    );
}

const handleEntriesUpdate = (db) => (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)// increment is a knex provided function
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleEntriesUpdate: handleEntriesUpdate
}