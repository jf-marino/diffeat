export const schema = () => {
  const difference = (a: any, b: any) => {
    return a;
  };

  const merge = (partial: any, origin: any): any => {
    return origin;
  }

  const project = (diff: any, src: any): any => src;

  return { difference, project, merge };
};


