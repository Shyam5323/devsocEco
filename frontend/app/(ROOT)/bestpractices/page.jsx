'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import NavbarLogIn from "@/components/NavbarLogedIn";

export default function RecommendationsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('recommendations');

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/api/v1/recommendation');
      return res.data.recommendations;
    },
  });

  const { data: history } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/api/v1/recommendation/history');
      return res.data.recommendations;
    },
  });

  const markAsImplemented = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/v1/recommendation/implement/${id}`, 
          {},  // No userId needed in request body
          { withCredentials: true }  // Ensure cookies are sent
        );
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error marking as implemented:", error.response?.data || error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["history"]);
    },
  });
  
  
  

  return (
    <div>
    <NavbarLogIn/>
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Sustainability Recommendations</h1>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${tab === 'recommendations' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('recommendations')}
        >
          Recommendations
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('history')}
        >
          Implementation History
        </button>
      </div>

      {isLoading ? (
        <p className="text-center">Loading recommendations...</p>
      ) : tab === 'recommendations' ? (
        <div className="space-y-4">
          {recommendations?.length ? recommendations.map((rec) => (
            <div key={rec._id} className="p-4 bg-white shadow rounded-lg">
              <h3 className="font-semibold text-lg">{rec.category}</h3>
              <p>{rec.suggestion}</p>
              <p className="text-sm text-gray-600">Impact: {rec.potential_impact} kg CO2</p>
              <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => markAsImplemented.mutate(rec._id)}
                disabled={markAsImplemented.isLoading}
                >
                {markAsImplemented.isLoading ? "Processing..." : "Mark as Implemented"}
                </button>

            </div>
          )) : <p>No recommendations available.</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {history?.length ? history.map((rec) => (
            <div key={rec._id} className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-lg">{rec.category}</h3>
              <p>{rec.suggestion}</p>
              <p className="text-sm text-gray-600">Impact: {rec.potential_impact} kg CO2</p>
            </div>
          )) : <p>No implemented recommendations yet.</p>}
        </div>
      )}
    </div>
    </div>
  );
}
