"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function UsernameModal({ isOpen, onClose, onSubmit }) {
    const [leetcode, setLeetcode] = useState("");
    const [codeforces, setCodeforces] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ leetcodeUsername: leetcode, codeforcesUsername: codeforces });
            onClose();
        } catch (error) {
            console.error("Failed to save usernames", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Connect Your Accounts</DialogTitle>
                    <DialogDescription>
                        Enter your LeetCode and Codeforces usernames to fetch your stats.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="leetcode" className="text-right">
                                LeetCode
                            </Label>
                            <Input
                                id="leetcode"
                                value={leetcode}
                                onChange={(e) => setLeetcode(e.target.value)}
                                className="col-span-3"
                                placeholder="username"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="codeforces" className="text-right">
                                Codeforces
                            </Label>
                            <Input
                                id="codeforces"
                                value={codeforces}
                                onChange={(e) => setCodeforces(e.target.value)}
                                className="col-span-3"
                                placeholder="username"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
