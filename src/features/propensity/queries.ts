import { useMutation } from "@tanstack/react-query";
import { postPropensity } from "@/features/propensity/api";

export function usePostPropensityMutation() {
  return useMutation({
    mutationFn: postPropensity,
  });
}
