import { useRandomNumber } from "./api";

export const RandomNumber = () => {
  const { randomNumber, isPending } = useRandomNumber();

  return <>{isPending ? "Loading..." : randomNumber}</>;
};
