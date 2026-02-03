// config.js
import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // =========================
    // Post CRUD
    // =========================

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug || ID.unique(),
                {   
                    title,
                    content, 
                    featuredImage, // store only file ID
                    status,
                    userId,
                }
            );
        } catch (error) {
            console.error("Appwrite service :: createPost :: error", error);
            return null;
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            );
        } catch (error) {
            console.error("Appwrite service :: updatePost :: error", error);
            return null;
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;
        } catch (error) {
            console.error("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.error("Appwrite service :: getPost :: error", error);
            return null;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.error("Appwrite service :: getPosts :: error", error);
            return null;
        }
    }

    // =========================
    // File upload / delete / get URL
    // =========================

    async uploadFile(file) {
        try {
            const uploaded = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
            return uploaded; // remember to store uploaded.$id in your post
        } catch (error) {
            console.error("Appwrite service :: uploadFile :: error", error);
            return null;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.error("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    // safer method to get image URLs that works for all file types
    getFileView(fileId) {
        if (!fileId) return "";
        return this.bucket.getFileView(conf.appwriteBucketId, fileId);
    }
}

const service = new Service();
export default service;
