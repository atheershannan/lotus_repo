// Mock axios module
const mockAxios = {
  create: jest.fn(() => mockAxios),
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  request: jest.fn(() => Promise.resolve({ data: {} })),
  defaults: {
    headers: {
      common: {},
      get: {},
      post: {},
    },
  },
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
};

// Export both default and named exports
module.exports = {
  ...mockAxios,
  default: mockAxios,
  get: mockAxios.get,
  post: mockAxios.post,
  put: mockAxios.put,
  delete: mockAxios.delete,
  patch: mockAxios.patch,
};

