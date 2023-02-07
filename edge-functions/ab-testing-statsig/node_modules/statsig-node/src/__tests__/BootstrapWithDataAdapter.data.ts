export const GateForConfigSpecTest = [
  {
    name: 'test_public',
    type: 'feature_gate',
    salt: '64fa52a6-4195-4658-b124-aa0be3ff8860',
    enabled: true,
    defaultValue: false,
    rules: [
      {
        name: '6X3qJgyfwA81IJ2dxI7lYp',
        groupName: 'public',
        passPercentage: 100,
        conditions: [
          {
            type: 'public',
            targetValue: null,
            operator: null,
            field: null,
            additionalValues: {},
            isDeviceBased: false,
            idType: 'userID',
          },
        ],
        returnValue: true,
        id: '6X3qJgyfwA81IJ2dxI7lYp',
        salt: '6X3qJgyfwA81IJ2dxI7lYp',
        isDeviceBased: false,
        idType: 'userID',
      },
    ],
    isDeviceBased: false,
    idType: 'userID',
    entity: 'feature_gate',
  },
];

export const GatesForIdListTest = [
  {
    name: 'test_id_list',
    type: 'feature_gate',
    salt: '7113c807-8236-477f-ac1c-bb8ac69bc9f7',
    enabled: true,
    defaultValue: false,
    rules: [
      {
        name: '1WF7SXC60cUGiiLvutKKQO',
        groupName: 'id_list',
        passPercentage: 100,
        conditions: [
          {
            type: 'pass_gate',
            targetValue: 'segment:user_id_list',
            operator: null,
            field: null,
            additionalValues: {},
            isDeviceBased: false,
            idType: 'userID',
          },
        ],
        returnValue: true,
        id: '1WF7SXC60cUGiiLvutKKQO',
        salt: '61ac4901-051f-4448-ae0e-f559cc55294e',
        isDeviceBased: false,
        idType: 'userID',
      },
    ],
    isDeviceBased: false,
    idType: 'userID',
    entity: 'feature_gate',
  },
  {
    name: 'segment:user_id_list',
    type: 'feature_gate',
    salt: '2b81f86d-abd5-444f-93f4-79edf1815cd2',
    enabled: true,
    defaultValue: false,
    rules: [
      {
        name: 'id_list',
        groupName: 'id_list',
        passPercentage: 100,
        conditions: [
          {
            type: 'unit_id',
            targetValue: 'user_id_list',
            operator: 'in_segment_list',
            additionalValues: {},
            isDeviceBased: false,
            idType: 'userID',
          },
        ],
        returnValue: true,
        id: 'id_list',
        salt: '',
        isDeviceBased: false,
        idType: 'userID',
      },
    ],
    isDeviceBased: false,
    idType: 'userID',
    entity: 'segment',
  },
];
