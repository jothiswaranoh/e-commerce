import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react-native';
import AppText from '@/components/AppText';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';
import { MOCK_ADDRESSES } from '@/lib/constants';

export default function AddressesScreen() {
    const router = useRouter();
    const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleDelete = (id: string) => {
        setAddresses(addresses.filter(a => a.id !== id));
    };

    const setDefault = (id: string) => {
        setAddresses(addresses.map(a => ({
            ...a,
            isDefault: a.id === id
        })));
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color={COLORS.neutral[900]} />
                </TouchableOpacity>
                <AppText variant="lg" weight="bold">Your Addresses</AppText>
                <View style={{ width: 44 }} />
            </View>

            <Animated.ScrollView
                style={[styles.scrollView, { opacity: fadeAnim }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {addresses.map((address) => (
                    <TouchableOpacity
                        key={address.id}
                        style={[styles.addressCard, address.isDefault && styles.defaultCard]}
                        activeOpacity={0.9}
                        onPress={() => setDefault(address.id)}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.typeBadge}>
                                <AppText variant="xs" weight="bold" color={COLORS.neutral[500]}>
                                    {address.type.toUpperCase()}
                                </AppText>
                            </View>
                            {address.isDefault && (
                                <View style={styles.defaultBadge}>
                                    <CheckCircle2 size={16} color={COLORS.success.DEFAULT} />
                                    <AppText variant="sm" weight="bold" color={COLORS.success.DEFAULT}>
                                        Default
                                    </AppText>
                                </View>
                            )}
                        </View>

                        <View style={styles.addressInfo}>
                            <AppText variant="md" weight="bold">{address.name}</AppText>
                            <AppText variant="sm" color={COLORS.neutral[700]} style={styles.street}>
                                {address.street}
                            </AppText>
                            <AppText variant="sm" color={COLORS.neutral[700]}>
                                {address.city}, {address.zip}
                            </AppText>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <AppText variant="sm" weight="medium" color={COLORS.info.DEFAULT}>Edit</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleDelete(address.id)}
                            >
                                <AppText variant="sm" weight="medium" color={COLORS.info.DEFAULT}>Remove</AppText>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.addNewCard}>
                    <Plus size={24} color={COLORS.neutral[400]} />
                    <AppText variant="md" weight="medium" color={COLORS.neutral[700]}>
                        Add a new address
                    </AppText>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[200],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
        backgroundColor: COLORS.neutral[0],
        ...SHADOWS.sm,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: BORDERS.radius.full,
        backgroundColor: COLORS.neutral[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    addressCard: {
        backgroundColor: COLORS.neutral[0],
        borderRadius: BORDERS.radius.sm,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: COLORS.neutral[300],
    },
    defaultCard: {
        borderColor: COLORS.accent.DEFAULT,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    typeBadge: {
        backgroundColor: COLORS.neutral[100],
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addressInfo: {
        marginBottom: SPACING.lg,
    },
    street: {
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.neutral[200],
        marginBottom: SPACING.sm,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.xl,
    },
    actionButton: {
        paddingVertical: 4,
    },
    addNewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.neutral[0],
        borderRadius: BORDERS.radius.sm,
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.neutral[300],
        marginTop: SPACING.sm,
    },
});
