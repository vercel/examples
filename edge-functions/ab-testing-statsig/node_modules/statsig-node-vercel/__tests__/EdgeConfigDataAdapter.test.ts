import { EdgeConfigDataAdapter } from '../EdgeConfigDataAdapter';
import fetchMock from "jest-fetch-mock"

describe('Validate edge config adapter functionality', () => {
  const dataAdapter = new EdgeConfigDataAdapter(
    'statsig-companyid'
  );

  beforeEach(async () => {
    fetchMock.enableMocks()
    fetchMock.mockResponse('"test123"');
    await dataAdapter.initialize();
  }); 

  afterEach(async () => {
    await dataAdapter.shutdown();
  });

  test('Simple get', async () => {
    const { result: gates } = await dataAdapter.get("statsig.cache");
    if (gates == null) {
      return;
    }
    expect(gates).toEqual('"test123"');
  });
})