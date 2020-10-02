import { ResumeModel } from './resume-model';

export type ResumeProvider = () => Promise<ResumeModel>;
