export const level = {
  meta: {
    title: 'Hello, World!',
    description: ''
  },
  entities: [],
  effectors: [],
  geometry: {
    vertices: [
      [-64, -64], // 0
      [64, -64], // 1
      [64, 64], // 2
      [-64, 64], // 3

      [-196, -128], // 4
      [-196, 128], // 5

      [-640, -128], // 6
      [-512, 128], // 7

      [-512, -320], // 8
      [-256, -320], // 9

      [-512, -480], // 10
      [-256, -480] // 11
    ],
    walls: [
      /**
       * Sector 1
       */
      {
        vertices: [0, 1],
        sectors: [0]
      },
      {
        vertices: [1, 2],
        sectors: [0]
      },
      {
        vertices: [2, 3],
        sectors: [0]
      },
      {
        vertices: [3, 0],
        sectors: [0, 1],
        // TODO: Cambiar esto por un conjunto de propiedades con sentido.
        hasMiddle: true
      },
      /**
       * Sector 2
       */
      {
        vertices: [0, 3],
        sectors: [1, 0]
      },
      {
        vertices: [3, 5],
        sectors: [1]
      },
      {
        vertices: [5, 4],
        sectors: [1, 2]
      },
      {
        vertices: [4, 0],
        sectors: [1]
      },
      /**
       * Sector 3
       */
      {
        vertices: [4, 5],
        sectors: [2, 1]
      },
      {
        vertices: [5, 7],
        sectors: [2]
      },
      {
        vertices: [7, 6],
        sectors: [2]
      },
      {
        vertices: [6, 4],
        sectors: [2, 3]
      },
      /**
       * Sector 4
       */
      {
        vertices: [4, 6],
        sectors: [3, 2]
      },
      {
        vertices: [6, 8],
        sectors: [3]
      },
      {
        vertices: [8, 9],
        sectors: [3, 4]
      },
      {
        vertices: [9, 4],
        sectors: [3]
      },
      /**
       * Sector 5
       */
      {
        vertices: [9, 8],
        sectors: [4, 3]
      },
      {
        vertices: [8, 10],
        sectors: [4]
      },
      {
        vertices: [10, 11],
        sectors: [4]
      },
      {
        vertices: [11, 9],
        sectors: [4]
      }
    ],
    sectors: [
      {
        walls: [0, 1, 2, 3],
        planes: [
          {
            height: -64
          },
          {
            height: 64
          }
        ]
      },
      {
        walls: [4, 5, 6, 7],
        planes: [
          {
            height: -56
          },
          {
            height: 56
          }
        ]
      },
      {
        walls: [8, 9, 10, 11],
        planes: [
          {
            height: -48
          },
          {
            height: 48
          }
        ]
      },
      {
        walls: [12, 13, 14, 15],
        planes: [
          {
            height: -40
          },
          {
            height: 40
          }
        ]
      },
      {
        walls: [16, 17, 18, 19],
        planes: [
          {
            height: -64
          },
          {
            height: 128
          }
        ]
      }
    ]
  }
}

export default level
