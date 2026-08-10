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

export type PropensityResult = {
  type: string;
  code: string;
  description: string;
  imageUrl: string;
};

export type PropensityResponse = PropensityRequest & {
  propensityResult: PropensityResult;
};
