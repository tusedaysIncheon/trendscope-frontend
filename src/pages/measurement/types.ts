import type { AnalyzeMode, Gender, MeasurementModel } from "@/types/trendscope";

export type MeasureFlowState = {
  measurementModel: MeasurementModel;
  mode: AnalyzeMode;
  gender: Gender;
  heightCm: number;
  weightKg?: number;
};

export type MeasureFrontPhotoState = MeasureFlowState & {
  frontFile: File;
};
