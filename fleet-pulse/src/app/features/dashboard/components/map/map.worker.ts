/// <reference lib="webworker" />

import { processMarkers } from './marker-processing';
import { MarkerProcessingRequest } from '../../../../core/models/marker-config.model';

addEventListener('message', ({ data }: MessageEvent<MarkerProcessingRequest>) => {
  const { vehicles, alerts } = data;
  const result = processMarkers(vehicles, alerts);
  postMessage(result);
});
