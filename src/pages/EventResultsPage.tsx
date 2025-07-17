import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEvent } from "../contexts/EventContext";
import { useAuth } from "../contexts/AuthContext";
import { Trophy, Medal, Award, ArrowLeft } from "lucide-react";

const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

function EventResultsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { events } = useEvent();
  const { users } = useAuth();

  const event = events.find((e) => e.id === eventId);

  const results = React.useMemo(() => {
    if (!event || !users.length) return [];

    const eventResults = event.registeredUsers.map((userId) => {
      const user = users.find((u) => u.id === userId);
      const userSubmissions = event.submissions[userId] || {};

      const baseScore = Object.values(userSubmissions).reduce(
        (acc, sub) => acc + sub.score,
        0
      );

      const allProblemsSolved = event.problems.every(
        (p) => userSubmissions[p.problemId]
      );
      const totalScore =
        baseScore + (allProblemsSolved ? event.completionBonus : 0);

      return {
        user: user || {
          id: userId,
          name: "Unknown User",
          email: "",
          avatar: "",
          points: 0,
          problemsSolved: 0,
          role: "user",
        },
        score: totalScore,
        problemsSolved: Object.keys(userSubmissions).length,
      };
    });

    return eventResults
      .sort((a, b) => b.score - a.score)
      .map((res, index) => ({ ...res, rank: index + 1 }));
  }, [event, users]);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Event not found
        </h1>
        <Link
          to="/events"
          className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return (
          <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
            #{rank}
          </span>
        );
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 dark:from-gray-700/20 dark:to-gray-600/20 dark:border-gray-500/30";
      case 3:
        return "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-500/30";
      default:
        return "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          to="/events"
          className="flex items-center text-orange-500 hover:text-orange-600 mb-4 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Events
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Results: {event.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Final standings for the event.
        </p>
      </div>

      {/* Top 3 Podium */}
      {results.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[results[1], results[0], results[2]].map((result, index) => (
            <div
              key={result.rank}
              className={`rounded-lg border p-6 ${getRankBackground(
                result.rank
              )} ${result.rank === 1 ? "md:scale-110 z-10" : ""}`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {getRankIcon(result.rank)}
                </div>
                {result.user.avatar ? (
                  <img
                    src={result.user.avatar}
                    alt={result.user.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">
                      {getInitials(result.user.name)}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {result.user.name}
                </h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                  {result.score.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  points
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Full Rankings
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Problems Solved
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {results.map(({ user, score, problemsSolved, rank }) => (
                <tr
                  key={rank}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">{getRankIcon(rank)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">
                            {getInitials(user.name)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {score.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {problemsSolved} / {event.problems.length}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EventResultsPage;
