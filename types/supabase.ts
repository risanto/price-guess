import type { UserData } from "./auth";
import type { Content, ContentInsertUpdate } from "./content";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserData;
        Insert: {
          // the data to be passed to .insert()
          id?: never; // generated columns must not be supplied
          email: string; // `not null` columns with no default must be supplied
        };
        Update: {
          // the data to be passed to .update()
          id?: never;
          email?: string; // `not null` columns are optional on .update()
        };
      };
      content: {
        Row: Content;
        Insert: ContentInsertUpdate;
        Update: ContentInsertUpdate;
      };
    };
  };
}
