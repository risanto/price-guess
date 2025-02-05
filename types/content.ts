type BaseContent = {
  initial_img_url: string;
  answer_img_url: string;
  info: {
    news_items: {
      link: string;
      title: string;
    }[];
  };
  analysis: string;
  price_goes_up: boolean;
  answer: number;
};

export type Content = BaseContent & {
  id: number;
  created_at: string;
};

export type ContentInsertUpdate = BaseContent & {
  id?: number;
};

export type ContentUpdate = BaseContent & {
  id?: number;
};
