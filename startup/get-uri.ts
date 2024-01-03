import { MongoMemoryServer } from "mongodb-memory-server"

const get_test_uri = async()=> {
    let server = await MongoMemoryServer.create()
    let uri = process.env.NODE_ENV === "test"? server.getUri(): process.env.URI
    return {server,uri}
  }

  export default get_test_uri