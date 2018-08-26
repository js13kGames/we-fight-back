const = sea: {

};

const blueColors = 'Teal,Marine,Aqua,Blue,Cobolt,Saphire,Cerulean,Skyblue,Turquoise,Cyan'.split(',');

const Array.prototype.random = (array) => {
  return array[Math.floor(Math.random()*items.length)];
}

const world = {
  width: 16000,
  height: 16000,
};

const AREATYPE_SEA = 1;
const AREATYPE_CONTINENT = 2;
const AREATYPE_COUNTRY = 3;
const AREATYPE_ADMINISTRATIVE = 4;
const AREATYPE_SETTLEMENT = 5;
const AREATYPE_CITY = 6;

const SEX_UNKNOWN = 0;
const SEX_MALE = 1;
const SEX_FEMALE = 2;

class Area {
  constructor({x, y, width, height, type}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  setName(value) {
    this.name = value;
  }
};

function generateMap(width, height) {

}

function generateSeas() {
  const seas = [];
  while(seas.length < 4) {
    const sea = {
      name: `${blueColors.random()} Sea`,
    };
    if (sea.length) {

    }
  }
}

const person = {
  name: 'Jeffery P. Hoffenberg',
  sex: SEX_MALE,
  birthdate: Date.UTC(320, 4, 9, 0, 0),
  death: {
    date: Date.UTC(350, 4, 9, 0, 0),
    cause: Conflicts or Illness or null,
    replacedBy: Person,
  }
  hometown: null,
  occupation: 'adventurer,captain,chief',
  log: [],
  children: [],
  father: [] or null (unknown) or undefined (unmentioned),
  mother: [] or null (unknown) or undefined (unmentioned),
};

everyEvent: {
  date: Date.UTC(340, 4, 9, 0, 0),
  location: ,
}

celebrations: {
  birthday: {
    present: gain,
  },
  adulthood: {},
};
gains: {
  friendship: {

  },
  item: {
    item: Item, // Map, compass, boat
  },
  family: {
    person: Person,
    relation: '',
  }
},
losses: {
  friendship: {
  },
  death: {
    relation: 'enemy|leader|crew|friend|parent|child|',
  }
}
changes: {
  rank: {
    oldRank:,
    newRank:,
    replaces:Person,
  },
  illness: {
    name:
    severity: 1 - 3,
  },
};
conflicts: {
  attackedBoat: {
    boat:,
  },
  attackedByBoat: {
    boat:,
  },
  attackedHumans: {
    group:,
  },
  attackedByBoat: {
    group:,
  },
  attackedByAnimal: {
    animal: ,
    count: ,
    weight: ,
    size: ,
    killed: true | false,
  },
  storm: {
    strength: 1 until 3,
  },
};

group: {
  leader: ,
  amount: ,
  members: [],
  type: 'indigenous,settlers,crew',
},



book {
  dateGranularity: 'year,month,day',
  dateFormat: 'absolute,relative',
  startDate: Date.UTC(330, 4, 9, 0, 0),
}
