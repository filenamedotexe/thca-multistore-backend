import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

export default medusaIntegrationTestRunner({
  testSuite: () => {
    console.log("Medusa THCA Backend initialized")
  }
})