export type PropensityRequest = {
  preference: {
    locality: number;
    frugality: number;
    experientiality: number;
    vitality: number;
    sociality: number;
  };
  valueConsumption: {
    accommodation: number;
    food: number;
    experience: number;
    transportation: number;
    cafeExhibition: number;
  };
};

export type PropensityResponse = PropensityRequest & {
  propensityResult: {
    type: string;
    description: string;
  };
};
