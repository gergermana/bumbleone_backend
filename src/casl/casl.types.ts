import { InferSubjects } from "@casl/ability";
import { Subjects } from "@casl/prisma";
import { Entry, Comment, Genre, Studio, User } from "@prisma/client";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

// export type AppSubjects = 
//     | { Anime: Anime }
//     | { Comment: Comment }
//     | { Genre: Genre }
//     | { Studio: Studio }
//     | { User: User }
//     | 'all';

export type AppSubjects = Subjects<{
    Anime: Entry;
    Comment: Comment;
    Genre: Genre;
    Studio: Studio;
    User: User;
}> | 'all';