import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { getData, saveData } from '../data/storage';

type Poll = {
  id: number;
  icon: string;
  title: string;
  question: string;
  yesVotes: number;
  noVotes: number;
};

const POLLS_KEY = 'polls';

const defaultPolls: Poll[] = [
  {
    id: 1,
    icon: '🗳️',
    title: 'Parking Area Improvement',
    question: 'Should the society improve the parking area?',
    yesVotes: 12,
    noVotes: 5,
  },
  {
    id: 2,
    icon: '📊',
    title: 'Security Improvement',
    question: 'Should additional security cameras be installed?',
    yesVotes: 18,
    noVotes: 7,
  },
];

export default function AdminPollsScreen() {
  const [polls, setPolls] = useState<Poll[]>([]);

  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [icon, setIcon] = useState('🗳️');

  // Load polls whenever admin opens this screen
  useFocusEffect(
    useCallback(() => {
      const loadPolls = async () => {
        const savedPolls =
          await getData<Poll[]>(POLLS_KEY);

        if (savedPolls) {
          setPolls(savedPolls);
        } else {
          setPolls(defaultPolls);
          await saveData(
            POLLS_KEY,
            defaultPolls,
          );
        }
      };

      loadPolls();
    }, [])
  );

  // Create new poll
  const createPoll = async () => {
    if (!title.trim() || !question.trim()) {
      Alert.alert(
        'Missing Details',
        'Please enter both poll title and question.',
      );
      return;
    }

    const highestId = polls.reduce(
      (max, poll) =>
        poll.id > max ? poll.id : max,
      0,
    );

    const newPoll: Poll = {
      id: highestId + 1,
      icon: icon.trim() || '🗳️',
      title: title.trim(),
      question: question.trim(),
      yesVotes: 0,
      noVotes: 0,
    };

    const updatedPolls = [
      newPoll,
      ...polls,
    ];

    setPolls(updatedPolls);

    await saveData(
      POLLS_KEY,
      updatedPolls,
    );

    setTitle('');
    setQuestion('');
    setIcon('🗳️');

    Alert.alert(
      'Poll Created',
      `${newPoll.title} has been added successfully.`,
    );
  };

  // Delete poll
  const deletePoll = (pollId: number) => {
    const selectedPoll = polls.find(
      (poll) => poll.id === pollId,
    );

    if (!selectedPoll) {
      return;
    }

    Alert.alert(
      'Delete Poll',
      `Are you sure you want to delete "${selectedPoll.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedPolls = polls.filter(
              (poll) => poll.id !== pollId,
            );

            setPolls(updatedPolls);

            await saveData(
              POLLS_KEY,
              updatedPolls,
            );

            Alert.alert(
              'Poll Deleted',
              'The poll has been removed successfully.',
            );
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.logo}>
        SocietyHub
      </Text>

      <View style={styles.adminBadge}>
        <Text style={styles.adminBadgeText}>
          ADMIN
        </Text>
      </View>

      <Text style={styles.title}>
        Poll Management
      </Text>

      <Text style={styles.subtitle}>
        Create and manage society polls.
      </Text>

      {/* Create Poll */}
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>
          Create New Poll
        </Text>

        <Text style={styles.label}>
          Poll Icon
        </Text>

        <TextInput
          style={styles.iconInput}
          value={icon}
          onChangeText={setIcon}
          placeholder="🗳️"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>
          Poll Title
        </Text>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Example: Garden Improvement"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>
          Question
        </Text>

        <TextInput
          style={styles.questionInput}
          value={question}
          onChangeText={setQuestion}
          placeholder="Example: Should the garden be improved?"
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
        />

        <Pressable
          style={styles.createButton}
          onPress={createPoll}
        >
          <Text style={styles.createButtonText}>
            + Create Poll
          </Text>
        </Pressable>
      </View>

      {/* Existing Polls */}
      <Text style={styles.sectionHeading}>
        Existing Polls
      </Text>

      {polls.map((poll) => {
        const totalVotes =
          poll.yesVotes + poll.noVotes;

        const yesPercentage =
          totalVotes === 0
            ? 0
            : Math.round(
                (poll.yesVotes / totalVotes) * 100,
              );

        const noPercentage =
          totalVotes === 0
            ? 0
            : Math.round(
                (poll.noVotes / totalVotes) * 100,
              );

        return (
          <View
            style={styles.pollCard}
            key={poll.id}
          >
            <View style={styles.pollTopRow}>
              <Text style={styles.pollIcon}>
                {poll.icon}
              </Text>

              <View style={styles.idBadge}>
                <Text style={styles.idText}>
                  POLL-{String(poll.id).padStart(3, '0')}
                </Text>
              </View>
            </View>

            <Text style={styles.pollTitle}>
              {poll.title}
            </Text>

            <Text style={styles.pollQuestion}>
              {poll.question}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.voteHeading}>
              Current Results
            </Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>
                Yes
              </Text>

              <Text style={styles.resultValue}>
                {poll.yesVotes} votes ({yesPercentage}%)
              </Text>
            </View>

            <View style={styles.barBackground}>
              <View
                style={[
                  styles.yesBar,
                  {
                    width: `${yesPercentage}%`,
                  },
                ]}
              />
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>
                No
              </Text>

              <Text style={styles.resultValue}>
                {poll.noVotes} votes ({noPercentage}%)
              </Text>
            </View>

            <View style={styles.barBackground}>
              <View
                style={[
                  styles.noBar,
                  {
                    width: `${noPercentage}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.totalVotes}>
              👥 {totalVotes} total votes
            </Text>

            <Pressable
              style={styles.deleteButton}
              onPress={() => deletePoll(poll.id)}
            >
              <Text style={styles.deleteButtonText}>
                🗑️ Delete Poll
              </Text>
            </Pressable>
          </View>
        );
      })}

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          ← Back to Admin Dashboard
        </Text>
      </Pressable>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 24,
    paddingTop: 55,
  },

  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 15,
  },

  adminBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 18,
    marginTop: -45,
    marginBottom: 30,
  },

  adminBadgeText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '800',
  },

  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    color: '#64748B',
    marginBottom: 30,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 24,
    marginBottom: 35,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },

  iconInput: {
    height: 52,
    width: 80,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 25,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    color: '#0F172A',
  },

  questionInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    color: '#0F172A',
  },

  createButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  sectionHeading: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },

  pollCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },

  pollTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  pollIcon: {
    fontSize: 42,
  },

  idBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  idText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
  },

  pollTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },

  pollQuestion: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },

  voteHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 15,
  },

  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
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

  barBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },

  yesBar: {
    height: 8,
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },

  noBar: {
    height: 8,
    backgroundColor: '#94A3B8',
    borderRadius: 10,
  },

  totalVotes: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 18,
  },

  deleteButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },

  backButton: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 30,
  },

  backText: {
    color: '#64748B',
    fontSize: 17,
    fontWeight: '600',
  },

  bottomSpace: {
    height: 40,
  },
});