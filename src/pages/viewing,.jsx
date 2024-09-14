import { useEffect, useState } from "react";
import { auth, db } from "../backend/config"; // Import your Firebase config
import { collection, doc, getDoc } from "firebase/firestore";
import { AdminDashboard } from "./AdminDashboard";
import { StudentDashboard } from "./StudentDashboard";
import { SupervisorDashboard } from "./SupervisorDashboard";

export const Dashboard = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the authenticated user's role
        const fetchUserRole = async () => {
            setLoading(true);
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                if (user) {
                    try {
                        const userId = user.uid; // Use user ID from Firebase Authentication
                        const userDocRef = doc(db, 'Users', userId); // Assuming you have a unified 'Users' collection
                        const userDoc = await getDoc(userDocRef);

                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            setRole(userData.role); // Set user role (Admin, Student, Supervisor)
                        } else {
                            console.error("No user document found");
                        }
                    } catch (error) {
                        console.error("Error fetching user role:", error);
                    }
                }
                setLoading(false);
            });

            return () => unsubscribe();
        };

        fetchUserRole();
    }, []);

    // Render different dashboards based on role
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!role) {
        return <div>No role found for this user.</div>;
    }

    return (
        <div>
            {role === "Admin" && <AdminDashboard />}
            {role === "Student" && <StudentDashboard />}
            {role === "Supervisor" && <SupervisorDashboard />}
        </div>
    );
};

