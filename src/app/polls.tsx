import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import { useCallback, useState } from 'react';
import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  getData,
  saveData,
} from '../data/storage';

type Poll = {
  id: number;
  icon: string;
  title: string;
  question: string;
  yesVotes: number;
  noVotes: number;
};

type ProfileData = {
  name: string;
  email: string;
  flat: string;
};

const POLLS_KEY = 'polls';
const PROFILE_KEY = 'profileData';

const initialPolls: Poll[] = [
  {
    id: 1,
    icon: '🗳️',
    title: 'Parking Area Improvement',
    question:
      'Should the society improve the parking area?',
    yesVotes: 12,
    noVotes: 5,
  },
  {
    id: 2,
    icon: '📊',
    title: 'Security Improvement',
    question:
      'Should additional security cameras be installed?',
    yesVotes: 18,
    noVotes: 7,
  },
];

export default function PollsScreen() {
  const [polls, setPolls] =
    useState<Poll[]>([]);

  const [
    selectedOptions,
    setSelectedOptions,
  ] = useState<{
    [key: number]: 'Yes' | 'No' | null;
  }>({});

  const [
    votedPolls,
    setVotedPolls,
  ] = useState<number[]>([]);

  const [userEmail, setUserEmail] =
    useState('');

  // --------------------------------
  // LOAD POLL DATA
  // --------------------------------

  useFocusEffect(
    useCallback(() => {
      const loadPollData = async () => {
        // Get currently logged-in user's profile
        const profile =
          await getData<ProfileData>(
            PROFILE_KEY,
          );

        const email =
          profile?.email?.trim().toLowerCase() || '';

        setUserEmail(email);

        // --------------------------------
        // LOAD SHARED POLLS
        // --------------------------------

        const savedPolls =
          await getData<Poll[]>(POLLS_KEY);

        if (savedPolls) {
          setPolls(savedPolls);
        } else {
          setPolls(initialPolls);

          await saveData(
            POLLS_KEY,
            initialPolls,
          );
        }

        // --------------------------------
        // LOAD THIS USER'S VOTE DATA
        // --------------------------------

        if (email) {
          const userVotedPollsKey =
            `votedPolls_${email}`;

          const userSelectedOptionsKey =
            `selectedPollOptions_${email}`;

          const savedVotedPolls =
            await getData<number[]>(
              userVotedPollsKey,
            );

          const savedSelectedOptions =
            await getData<{
              [key: number]:
                | 'Yes'
                | 'No'
                | null;
            }>(
              userSelectedOptionsKey,
            );

          if (savedVotedPolls) {
            setVotedPolls(
              savedVotedPolls,
            );
          } else {
            setVotedPolls([]);
          }

          if (savedSelectedOptions) {
            setSelectedOptions(
              savedSelectedOptions,
            );
          } else {
            setSelectedOptions({});
          }
        } else {
          setVotedPolls([]);
          setSelectedOptions({});
        }
      };

      loadPollData();
    }, [])
  );

  // --------------------------------
  // SELECT YES / NO
  // --------------------------------

  const selectOption = (
    pollId: number,
    option: 'Yes' | 'No',
  ) => {
    if (votedPolls.includes(pollId)) {
      return;
    }

    setSelectedOptions({
      ...selectedOptions,
      [pollId]: option,
    });
  };

  // --------------------------------
  // SUBMIT VOTE
  // --------------------------------

  const submitVote = async (
    pollId: number,
  ) => {
    const selected =
      selectedOptions[pollId];

    if (!userEmail) {
      Alert.alert(
        'Login Required',
        'Please login before voting.',
      );
      return;
    }

    if (!selected) {
      Alert.alert(
        'Select an option',
        'Please select Yes or No before submitting your vote.',
      );
      return;
    }

    if (votedPolls.includes(pollId)) {
      return;
    }

    // --------------------------------
    // UPDATE SHARED POLL RESULTS
    // --------------------------------

    const updatedPolls =
      polls.map((poll) => {
        if (poll.id !== pollId) {
          return poll;
        }

        return {
          ...poll,

          yesVotes:
            selected === 'Yes'
              ? poll.yesVotes + 1
              : poll.yesVotes,

          noVotes:
            selected === 'No'
              ? poll.noVotes + 1
              : poll.noVotes,
        };
      });

    // --------------------------------
    // UPDATE THIS USER'S VOTE STATE
    // --------------------------------

    const updatedVotedPolls = [
      ...votedPolls,
      pollId,
    ];

    const updatedSelectedOptions = {
      ...selectedOptions,
      [pollId]: selected,
    };

    // Update screen
    setPolls(updatedPolls);
    setVotedPolls(
      updatedVotedPolls,
    );
    setSelectedOptions(
      updatedSelectedOptions,
    );

    // --------------------------------
    // SAVE SHARED POLL RESULTS
    // --------------------------------

    await saveData(
      POLLS_KEY,
      updatedPolls,
    );

    // --------------------------------
    // SAVE USER-SPECIFIC VOTE STATE
    // --------------------------------

    const userVotedPollsKey =
      `votedPolls_${userEmail}`;

    const userSelectedOptionsKey =
      `selectedPollOptions_${userEmail}`;

    await saveData(
      userVotedPollsKey,
      updatedVotedPolls,
    );

    await saveData(
      userSelectedOptionsKey,
      updatedSelectedOptions,
    );

    Alert.alert(
      'Vote Submitted',
      `Your vote "${selected}" has been submitted successfully.`,
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Polls
      </Text>

      <Text style={styles.subtitle}>
        Give your opinion on society matters
      </Text>

      {polls.map((poll) => {
        const selected =
          selectedOptions[poll.id];

        const hasVoted =
          votedPolls.includes(poll.id);

        const totalVotes =
          poll.yesVotes +
          poll.noVotes;

        const yesPercentage =
          totalVotes === 0
            ? 0
            : Math.round(
                (poll.yesVotes /
                  totalVotes) *
                  100,
              );

        const noPercentage =
          totalVotes === 0
            ? 0
            : Math.round(
                (poll.noVotes /
                  totalVotes) *
                  100,
              );

        return (
          <View
            style={styles.card}
            key={poll.id}
          >
            <Text style={styles.icon}>
              {poll.icon}
            </Text>

            <Text style={styles.cardTitle}>
              {poll.title}
            </Text>

            <Text style={styles.question}>
              {poll.question}
            </Text>

            {/* YES */}
            <Pressable
              style={[
                styles.option,
                selected === 'Yes' &&
                  styles.selectedOption,
              ]}
              onPress={() =>
                selectOption(
                  poll.id,
                  'Yes',
                )
              }
              disabled={hasVoted}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === 'Yes' &&
                    styles.selectedOptionText,
                ]}
              >
                Yes
              </Text>
            </Pressable>

            {/* NO */}
            <Pressable
              style={[
                styles.option,
                selected === 'No' &&
                  styles.selectedOption,
              ]}
              onPress={() =>
                selectOption(
                  poll.id,
                  'No',
                )
              }
              disabled={hasVoted}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === 'No' &&
                    styles.selectedOptionText,
                ]}
              >
                No
              </Text>
            </Pressable>

            {/* SUBMIT */}
            {!hasVoted ? (
              <Pressable
                style={styles.voteButton}
                onPress={() =>
                  submitVote(
                    poll.id,
                  )
                }
              >
                <Text
                  style={styles.voteText}
                >
                  Submit Vote
                </Text>
              </Pressable>
            ) : (
              <View
                style={styles.votedBadge}
              >
                <Text
                  style={styles.votedText}
                >
                  ✓ Vote Submitted
                </Text>
              </View>
            )}

            {/* RESULTS */}
            {hasVoted && (
              <View
                style={
                  styles.resultsContainer
                }
              >
                <Text
                  style={styles.resultsTitle}
                >
                  Current Results
                </Text>

                <View
                  style={styles.resultRow}
                >
                  <Text
                    style={
                      styles.resultLabel
                    }
                  >
                    Yes
                  </Text>

                  <Text
                    style={
                      styles.resultValue
                    }
                  >
                    {poll.yesVotes} votes (
                    {yesPercentage}%)
                  </Text>
                </View>

                <View
                  style={
                    styles.resultBarBackground
                  }
                >
                  <View
                    style={[
                      styles.resultBar,
                      {
                        width: `${yesPercentage}%`,
                      },
                    ]}
                  />
                </View>

                <View
                  style={styles.resultRow}
                >
                  <Text
                    style={
                      styles.resultLabel
                    }
                  >
                    No
                  </Text>

                  <Text
                    style={
                      styles.resultValue
                    }
                  >
                    {poll.noVotes} votes (
                    {noPercentage}%)
                  </Text>
                </View>

                <View
                  style={
                    styles.resultBarBackground
                  }
                >
                  <View
                    style={[
                      styles.resultBar,
                      {
                        width: `${noPercentage}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        );
      })}

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          ← Back
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
  },

  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 50,
  },

  subtitle: {
    fontSize: 18,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
  },

  icon: {
    fontSize: 45,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  question: {
    fontSize: 17,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 20,
  },

  option: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },

  selectedOption: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },

  optionText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
    textAlign: 'center',
  },

  selectedOptionText: {
    color: '#2563EB',
    fontWeight: '700',
  },

  voteButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  voteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  votedBadge: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  votedText: {
    color: '#16A34A',
    fontSize: 16,
    fontWeight: '700',
  },

  resultsContainer: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 18,
  },

  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  resultLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },

  resultValue: {
    fontSize: 14,
    color: '#64748B',
  },

  resultBarBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },

  resultBar: {
    height: 8,
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },

  backButton: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 40,
  },

  backText: {
    color: '#64748B',
    fontSize: 17,
  },
});