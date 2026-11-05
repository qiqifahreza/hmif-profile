export interface Member {
  name: string;
  role: string;
  nim?: string;
  imageUrl?: string;
}

export interface DivisionProker {
  title: string;
  description: string;
  period: string;
}

export interface DivisionDetail {
  slug: string;
  name: string;
  shortName: string;
  about: string;
  leader: Member;
  coLeader?: Member;
  members: Member[];
  programs: DivisionProker[];
}

export interface EventProgram {
  id: string;
  title: string;
  date: string;
  description: string;
  tag: string;
}

export interface Member {
  name: string;
  role: string;
  nim?: string;
}

export interface DivisionProker {
  title: string;
  description: string;
  period: string;
}

export interface DivisionDetail {
  slug: string;
  name: string;
  shortName: string;
  about: string;
  leader: Member;
  coLeader?: Member;
  members: Member[];
  programs: DivisionProker[];
}

export interface EventProgram {
  id: string;
  title: string;
  date: string;
  description: string;
  tag: string;
}



